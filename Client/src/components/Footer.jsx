const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div>
        <h4>About ShopEZ</h4>
        <ul>
          <li>About Us</li>
          <li>Careers</li>
          <li>Press</li>
          <li>Corporate Information</li>
        </ul>
      </div>
      <div>
        <h4>Help</h4>
        <ul>
          <li>Payments</li>
          <li>Shipping</li>
          <li>Cancellation & Returns</li>
          <li>FAQ</li>
        </ul>
      </div>
      <div>
        <h4>Policy</h4>
        <ul>
          <li>Return Policy</li>
          <li>Terms Of Use</li>
          <li>Security</li>
          <li>Privacy</li>
        </ul>
      </div>
      <div>
        <h4>ShopEZ</h4>
        <ul>
          <li>Gift Cards</li>
          <li>ShopEZ Plus</li>
          <li>Sell on ShopEZ</li>
          <li>Advertise</li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
