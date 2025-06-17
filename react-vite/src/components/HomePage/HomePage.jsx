import './HomePage.css';

function HomePage() {
  return (
    <div className="simple-homepage">
      <div className="left-image">
        <img src="https://images.squarespace-cdn.com/content/v1/64067c5471624b6a98a0228c/1678147913069-YNN4F8KVA5VAAU0K13YY/image-asset.png?format=2500w" alt="Plant" />
      </div>

      <div className="right-text">
        <h1>Plant Care<br />Made Simpler</h1>
        <p className="subtitle">
          Easily find care instructions for over thousands of plant species!
        </p>
      </div>
    </div>
  );
}

export default HomePage;
