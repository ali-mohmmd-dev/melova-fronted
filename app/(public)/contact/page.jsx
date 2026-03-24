import React from "react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Melova - Contact Us | Reach Out",
  description:
    "Contact Melova for inquiries, bulk orders, or general questions about our artisanal chocolates.",
};

export default function Contact() {
  return (
    <>
      {/* Page Header Start */}
      <div className="page-header bg-section parallaxie">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <h1 className="text-anime-style-2" data-cursor="-opaque">
                  Contact <span>us</span>
                </h1>
                <nav className="wow fadeInUp">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/">home</Link>
                    </li>
                    <li className="bread" aria-current="page">
                      contact us
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Header End */}

      {/* Page Contact Us Start */}
      <div className="page-contact-us bg-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="contact-us-content">
                <div className="section-title">
                  <h3 className="wow fadeInUp">Contact us</h3>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    We&apos;re here to chat and share the{" "}
                    <span>love for pastries</span>
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay="0.2s">
                    Feel free to reach out — we&apos;re just a message away with
                    something sweet to say!
                  </p>
                </div>

                <div
                  className="contact-info-list wow fadeInUp"
                  data-wow-delay="0.4s"
                >
                  <div className="contact-info-item">
                    <div className="contact-info-header">
                      <div className="icon-box">
                        <Image src="/images/icon-phone.svg" alt="Phone Icon" width={40} height={40} />
                      </div>
                      <div className="contact-info-title">
                        <h3>Connect now</h3>
                      </div>
                    </div>
                    <div className="contact-info-body">
                      <p>
                        <a href="tel:+123456789">+(123)456-789</a> /{" "}
                        <a href="tel:987456321">+(987)456-321</a>
                      </p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-header">
                      <div className="icon-box">
                        <Image src="/images/icon-mail.svg" alt="Mail Icon" width={40} height={40} />
                      </div>
                      <div className="contact-info-title">
                        <h3>Email us</h3>
                      </div>
                    </div>
                    <div className="contact-info-body">
                      <p>
                        <a href="mailto:support@domainname.com">
                          support@domainname.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="location-info-list wow fadeInUp"
                  data-wow-delay="0.6s"
                >
                  <div className="contact-info-item">
                    <div className="contact-info-header">
                      <div className="icon-box">
                        <Image src="/images/icon-location.svg" alt="Location Icon" width={40} height={40} />
                      </div>
                      <div className="contact-info-title">
                        <h3>Visit our Factory</h3>
                      </div>
                    </div>
                    <div className="contact-info-body">
                      <p>Perinthalmanna, Kerala 679322</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-header">
                      <div className="icon-box">
                        <Image src="/images/icon-clock.svg" alt="Clock Icon" width={40} height={40} />
                      </div>
                      <div className="contact-info-title">
                        <h3>Working hour</h3>
                      </div>
                    </div>
                    <div className="contact-info-body">
                      <p>Mon to Sat : 8:00 AM - 8:00 PM</p>
                      <p>Sunday : Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="contact-us-form">
                <div className="section-title">
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    Contact <span>us</span>
                  </h2>
                </div>

                <div className="contact-form">
                  <form
                    id="contactForm"
                    action="#"
                    method="POST"
                    data-toggle="validator"
                    className="contact-form wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <div className="row">
                      <div className="form-group col-md-6 mb-4">
                        <input
                          type="text"
                          name="fname"
                          className="form-control"
                          id="fname"
                          placeholder="First name"
                          required
                        />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input
                          type="text"
                          name="lname"
                          className="form-control"
                          id="lname"
                          placeholder="Last name"
                          required
                        />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="email"
                          placeholder="E-mail"
                          required
                        />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-6 mb-4">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          id="phone"
                          placeholder="Phone"
                          required
                        />
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="form-group col-md-12 mb-5">
                        <textarea
                          name="message"
                          className="form-control"
                          id="message"
                          rows="3"
                          placeholder="Write Message..."
                        ></textarea>
                        <div className="help-block with-errors"></div>
                      </div>

                      <div className="col-md-12">
                        <button type="submit" className="btn-default">
                          <span>submit message</span>
                        </button>
                        <div id="msgSubmit" className="h3 hidden"></div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Contact Us End */}

      {/* Google Map Section Start */}
      <div className="google-map bg-section">
        <div className="container-fluid">
          <div className="row no-gutters">
            <div className="col-lg-12">
              <div className="google-map-iframe">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7089.057857943573!2d76.21753111167159!3d10.976052711062733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cdab4ff17fb1%3A0x88dc55155412ba1f!2sPerinthalmanna!5e1!3m2!1sen!2sin!4v1756793810412!5m2!1sen!2sin"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Google Map Section End */}
    </>
  );
}
