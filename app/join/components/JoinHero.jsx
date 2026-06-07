"use client";

export default function JoinHero() {
  const handleButtonClick = (hash) => {
    if (window.location.hash === `#${hash}`) {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      window.location.hash = hash;
    }
  };

  return (
    <section className="join-hero-section" aria-labelledby="join-hero-title">
      <div className="join-hero-background" aria-hidden="true" />
      <div className="join-hero-container">
        <div className="join-hero-content">
          <span className="join-hero-eyebrow">PROFESSIONAL GATEWAY</span>
          <h1 id="join-hero-title" className="join-hero-title">
            Join the Athena Community
          </h1>
          <p className="join-hero-subtitle">
            AIPP serves as a nexus for deep intellectual labor and strategic political praxis.
            We are expanding our network of dedicated researchers, future policy leaders, and
            strategic thinkers committed to democratic stability.
          </p>
          <div className="join-hero-actions">
            <button 
              type="button" 
              className="join-hero-btn solid"
              onClick={() => handleButtonClick("member")}
            >
              BECOME A MEMBER
            </button>
            <button 
              type="button" 
              className="join-hero-btn outline"
              onClick={() => handleButtonClick("volunteer")}
            >
              REGISTER AS VOLUNTEER
            </button>
          </div>
        </div>

        <div className="join-hero-visual" aria-hidden="true">
          <div className="join-schematic-box">
            <div className="schematic-line-h" />
            <div className="schematic-line-v" />
            <div className="schematic-diagonal-1" />
            <div className="schematic-diagonal-2" />
            <div className="schematic-circle" />
            <div className="schematic-square" />
          </div>
        </div>
      </div>
    </section>
  );
}
