import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../LandingPage.css';  // Create this CSS file for custom styles

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="hero-section text-center">
        <Container>
          <br></br>
          <h1 className="hero-title">Earn Rewards Every Time You Dine!</h1>
          <p className="hero-subtitle">Join My Qulture Rewards and get 1% back on every purchase. Just add us on Line Official</p>
          <Button variant="warning" size="lg" as={Link} to="https://lin.ee/hbKtoo0" className="cta-button">
            Sign Up Now
          </Button>
        </Container>
      </header>

      <section className="how-it-works-section">
        <Container>
          <h2 className="section-title text-center how-it-works-text">How My Qulture Rewards Works</h2>
          <Row className="text-center how-it-works-text">
            <Col md={4}>
            <br></br>
              <div className="icon-box">
                <img src="https://freepngimg.com/download/machine/55110-7-rewards-image-free-clipart-hq.png" alt="Earn Icon" className="icon"/>
              </div>

              <h3>Earn</h3>
              <p>Get 1% back in store credit on every purchase you make at Qulture Lounge.</p>
            </Col>
            <Col md={4}>
            <br></br>
              <div className="icon-box">
                <img src="https://cdn-icons-png.flaticon.com/512/5499/5499587.png" alt="Redeem Icon" className="icon"/>
              </div>

              <h3>Redeem</h3>
              <p>Redeem your rewards in 50 THB increments—easy and flexible.</p>
            </Col>
            <Col md={4}>
            <br></br>
              <div className="icon-box">
                <img src="https://cdn3.iconfinder.com/data/icons/celebrations-flat-colorful/614/4652_-_Fireworks-1024.png" alt="Celebrate Icon" className="icon"/>
              </div>

              <h3>Celebrate</h3>
              <p>Enjoy special perks on your birthday and exclusive offers during appreciation events.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="rewards-benefits-section">
        <Container>
          <h2 className="section-title text-center  how-it-works-text">Exclusive Benefits for Members</h2>
          <ul className="benefits-list  how-it-works-text">
            <li>1% back on every in-store purchase.</li>
            <li>Redeem rewards starting at just 50 THB.</li>
            <li>Birthday perks: Special discounts and surprises.</li>
            <li>Access to exclusive appreciation events and offers.</li>
          </ul>
        </Container>
      </section>

      <section className="testimonials-section">
        <Container>
          <h2 className="section-title text-center  how-it-works-text">What Our Members Are Saying</h2>
          <Row>
            <Col md={6}>
              <blockquote className="testimonial">
                "I love earning rewards every time I visit Qulture Lounge! The birthday perks are fantastic too!"
                <footer>- Alan</footer>
              </blockquote>
            </Col>
            <Col md={6}>
              <blockquote className="testimonial">
                "My Qulture Rewards is so easy to use. Redeeming rewards for discounts is a breeze!"
                <footer>- Lee</footer>
              </blockquote>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="signup-cta-section text-center">
        <Container>
          <h2>Ready to Start Earning?</h2>
          <Button variant="warning" size="lg" as={Link} to="https://lin.ee/hbKtoo0" className="cta-button">
            Join My Qulture Rewards Now
          </Button>
        </Container>
      </section>

     
    </div>
  );
};

export default LandingPage;
