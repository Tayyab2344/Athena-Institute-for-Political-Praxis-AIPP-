"use client";

export default function RPIIntro() {
  return (
    <section className="rpi-intro-section" aria-labelledby="intro-title">
      <div className="rpi-intro-grid">
        <div className="intro-left">
          <span className="rule" aria-hidden="true" />
          <h2 id="intro-title">Rigorous Analysis for a Changing World</h2>
        </div>

        <div className="intro-right">
          <p className="intro-lead">
            The Research & Policy Innovation (RPI) division serves as the intellectual engine
            of the Athena Institute. We move beyond reactive policymaking, employing longitudinal
            data analysis and predictive modeling to anticipate governance challenges before they
            manifest.
          </p>
          <p className="intro-body">
            Our methodology is rooted in academic independence and radical transparency. By
            bridging the gap between theoretical political science and practical administrative
            implementation, RPI provides policymakers with the tools to build more resilient,
            democratic institutions.
          </p>
          <div className="intro-action">
            <a className="methodology-link" href="#methodology">
              Learn About Our Methodology <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
