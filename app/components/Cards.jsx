import { ArrowLink } from "./Section";

export function FeatureCard({ title, text, icon }) {
  return (
    <article className="feature-card">
      <span className="line-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function DivisionCard({ index, label, title, text, featured }) {
  return (
    <article className={featured ? "division-card division-card-featured" : "division-card"}>
      <p>{index}</p>
      <span>{label}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <ArrowLink href="#join">Explore Division</ArrowLink>
    </article>
  );
}

export function ProgramCard({ title, text, cta, image, priority = false }) {
  return (
    <article className="program-card">
      <img
        src={image}
        alt=""
        width="640"
        height="360"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
        <a href="#join">{cta}</a>
      </div>
    </article>
  );
}

export function PublicationCard({ title, type, text, icon }) {
  return (
    <article className="publication-card">
      <span className="publication-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{type}</p>
      <small>{text}</small>
    </article>
  );
}
