import React, { Component } from "react";
import Toastify, { prototype } from "toastify-js";
import "toastify-js/src/toastify.css";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import PropTypes from "prop-types";
import ReactLoading from "react-loading";
export default class Portfolio extends Component {
  state = {
    name: "",
    email: "",
    message: "",
    recaptchaToken: "",
    verified: null,
  };
  constructor() {
    super();
    this.onFormChange = this.onFormChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.updateRecaptchaToken = this.updateRecaptchaToken.bind(this);
  }
  onFormChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  updateRecaptchaToken(token) {
    this.setState({ recaptchaToken: token });
    const { apiFastMail } = this.props.resumeData;
    fetch(apiFastMail + "/captcha", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "g-recaptcha-response": token }),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        this.setState({ verified: result.success });
      })
      .catch((err) => console.log(err));
  }
  validEmail(email) {
    return new Promise((resolve, reject) => {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(email).toLowerCase())) resolve(true);
      else resolve(false);
    });
  }
  showToastWarning(text) {
    Toastify({
      text: text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #fca000, #de8d00)",
      stopOnFocus: true,
    }).showToast();
  }
  showToastError(text) {
    Toastify({
      text: text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #db0000,#9e0606)",
      stopOnFocus: true,
    }).showToast();
  }
  showToastSuccess(text) {
    Toastify({
      text: text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00e335,#00c42e)",
      stopOnFocus: true,
    }).showToast();
  }
  onSubmitForm() {
    const { apiFastMail } = this.props.resumeData;
    if (!this.state.verified) {
      this.showToastError("Security error - Refresh page or Try later.");
      return;
    }
    const { name, email, message, recaptchaToken } = this.state;
    if (!name || !email || !message || !recaptchaToken) {
      this.showToastWarning("All fields are required");
      return;
    }
    this.validEmail(email).then((isValid) => {
      if (isValid) {
        let bodyRequest = JSON.stringify({
          subject: "Contato - Portifolio",
          emailContact: email,
          text: `${name}\n\n${message}`,
          "g-recaptcha-response": recaptchaToken,
        });
        this.props.onLoading(true);
        fetch(apiFastMail + "/", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Request-Method": "POST",
          },
          body: bodyRequest,
        }).then((response) => {
          this.props.onLoading(false);
          if (response.status == 200) {
            this.setState({
              name: "",
              email: "",
              message: "",
            });
            this.showToastSuccess("Form submitted successfully");
          } else if (response.status == 400)
            this.showToastWarning(response.statusText);
          else this.showToastError(response.statusText);
        });
      } else {
        this.showToastWarning("Please insert valid email.");
      }
    });
  }
  render() {
    return (
      <section id="portfolio">
        <div className="row">
          <div className="twelve columns collapsed">
            <h1>Contact</h1>
            <div
              id="portfolio-wrapper"
              className="bgrid-quarters s-bgrid-thirds cf"
            >
              <label for="inp" className="inp">
                <input
                  type="text"
                  id="inp"
                  name="name"
                  onChange={this.onFormChange}
                  value={this.state.name}
                  placeholder="&nbsp;"
                />
                <span className="label">Name*</span>
                <span className="focus-bg" />
              </label>
              <label for="inp" className="inp">
                <input
                  type="email"
                  name="email"
                  id="inp"
                  value={this.state.email}
                  onChange={this.onFormChange}
                  placeholder="&nbsp;"
                />
                <span className="label">Email*</span>
                <span className="focus-bg" />
              </label>
              <label for="inp" className="inp">
                <textarea
                  type="text"
                  name="message"
                  id="inp"
                  value={this.state.message}
                  onChange={this.onFormChange}
                  placeholder="&nbsp;"
                />
                <span className="label">Message*</span>
                <span className="focus-bg" />

                <br />
                <div>
                  <button
                    onClick={this.onSubmitForm}
                    disabled={!this.state.verified}
                    className="sendBtn"
                  >
                    Send
                  </button>
                  <span
                    for="sendBtn"
                    style={{
                      color:
                        this.state.verified != null ? "#db0000" : "#8b9798",
                    }}
                    hidden={this.state.verified}
                  >
                    {this.state.verified != null
                      ? !this.state.verified
                        ? "Security Verify Failed"
                        : ""
                      : "Security checking..."}
                  </span>
                </div>
              </label>
            </div>
            <GoogleReCaptcha
              onVerify={(token) => this.updateRecaptchaToken(token)}
            />
          </div>
        </div>
      </section>
    );
  }
}
Portfolio.propTypes = {
  resumeData: PropTypes.array,
  onLoading: PropTypes.func,
};
