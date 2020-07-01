import React, { Component } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default class About extends Component {
  componentDidMount() {
    AOS.init();
  }
  render() {
    let resumeData = this.props.resumeData;
    return (
      <section id="about">
        <div className="row">
          <div className="three columns" data-aos='fade-right'>
            <img className="profile-pic" src="images/profilepic.jpg" alt="" />
          </div>

          <div className="nine columns main-col" data-aos='fade-left'>
            <h2>About Me</h2>
            <p>{resumeData.aboutme}</p>

            <div className="row">
              <div className="columns contact-details">
                <h2>Contact Details</h2>
                <p className="address">
                  <span>{resumeData.name}</span>
                  <br />
                  <span>{resumeData.address}</span>
                  <br />
                  <span>{resumeData.website}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
