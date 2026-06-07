import type { GalleryCardData } from "./galleryData";

function renderHeadline(headline: string) {
  // Split on the ‹kw›…‹/kw› marker; wrap the keyword in <span class="kw">.
  const parts = headline.split(/‹kw›(.*?)‹\/kw›/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="kw">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function GalleryCard({ card }: { card: GalleryCardData }) {
  return (
    <article className="gallery-card">
      <div className="gallery-card__visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt={card.alt} loading="lazy" />
      </div>
      <div className="gallery-card__body">
        <p className="gallery-card__eyebrow">{card.eyebrow}</p>
        <h3 className="gallery-card__headline">{renderHeadline(card.headline)}</h3>
        <p className="gallery-card__copy">{card.body}</p>
      </div>
    </article>
  );
}
