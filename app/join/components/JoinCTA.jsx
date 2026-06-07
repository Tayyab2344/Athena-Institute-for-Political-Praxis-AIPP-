"use client";

export default function JoinCTA() {
  const handleButtonClick = (hash) => {
    if (window.location.hash === `#${hash}`) {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      window.location.hash = hash;
    }
  };

  return (
    <section className="join-cta-section" aria-labelledby="join-cta-title">
      <div className="join-cta-container">
        <h2 id="join-cta-title" className="join-cta-heading">
          Become Part of a New Generation of Political Thinkers and Practitioners
        </h2>
        <p className="join-cta-subheading">
          The complexity of the modern world requires more than just commentators; it
          requires praxis.
        </p>
        <div className="join-cta-actions">
          <button 
            type="button" 
            className="join-cta-btn solid"
            onClick={() => handleButtonClick("member")}
          >
            APPLY FOR MEMBERSHIP
          </button>
          <button 
            type="button" 
            className="join-cta-btn outline"
            onClick={() => handleButtonClick("volunteer")}
          >
            REGISTER AS VOLUNTEER
          </button>
        </div>
      </div>
    </section>
  );
}
