import Link from "next/link";
import styles from "./entorno.module.css";

type EntornoPageProps = {
  location: any;
};

const iconSymbols: Record<string, string> = {
  lake: "◌",
  club: "◇",
  restaurant: "✦",
  sport: "△",
  nature: "♧",
  family: "◎",
  privacy: "□"
};

export default function EntornoPage({ location }: EntornoPageProps) {
  return (
    <main className={styles.entornoPage}>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <img src={location.hero.image} alt={location.hero.title} />
        </div>

        <div className={styles.heroOverlay} />

        <div className={styles.heroNav}>
          <div className={styles.logo}>LARUM</div>

          <Link href="/" className={styles.backLink}>
            Volver a la propiedad
          </Link>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{location.hero.title}</h1>
          <p className={styles.heroSubtitle}>{location.hero.subtitle}</p>
        </div>
      </section>

      {location.intro && (
        <section className={styles.section}>
          <div className={styles.twoColumn}>
            <div>
              <div className={styles.eyebrow}>{location.intro.eyebrow}</div>
              <h2 className={styles.sectionTitle}>{location.intro.title}</h2>
              <p className={styles.text}>{location.intro.text}</p>
            </div>

            <div className={styles.imageFrame}>
              <img src={location.intro.image} alt={location.intro.title} />
            </div>
          </div>
        </section>
      )}

      {location.lifestyle?.length > 0 && (
        <section className={styles.lifestyleSection}>
          <div className={styles.lifestyleGrid}>
            {location.lifestyle.map((item: any) => (
              <div className={styles.lifestyleItem} key={item.label}>
                <div className={styles.lifestyleIcon}>
                  {iconSymbols[item.icon] || "•"}
                </div>
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {location.experiences?.items?.length > 0 && (
        <section className={styles.section}>
          <div className={styles.eyebrow}>{location.experiences.eyebrow}</div>
          <h2 className={styles.sectionTitle}>{location.experiences.title}</h2>

          <div className={styles.cardsGrid}>
            {location.experiences.items.map((item: any) => (
              <article className={styles.card} key={item.title}>
                <div className={styles.cardImage}>
                  <img src={item.image} alt={item.title} />
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {location.distances && (
        <section className={styles.section}>
          <div className={styles.twoColumn}>
            <div className={styles.imageFrame}>
              <img src={location.distances.image} alt={location.distances.title} />
            </div>

            <div>
              <div className={styles.eyebrow}>{location.distances.eyebrow}</div>
              <h2 className={styles.sectionTitle}>{location.distances.title}</h2>

              <div className={styles.distanceList}>
                {location.distances.items.map((item: any) => (
                  <div className={styles.distanceItem} key={item.place}>
                    <span className={styles.distancePlace}>{item.place}</span>
                    <span className={styles.distanceTime}>
                      {item.time} en coche
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {location.living && (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <div className={styles.eyebrow}>{location.living.eyebrow}</div>
      <h2 className={styles.sectionTitle}>{location.living.title}</h2>
    </div>

    <div className={styles.livingGrid}>
      {location.living.items.map((item: any) => (
        <article className={styles.livingCard} key={item.title}>
          {item.image && (
            <div className={styles.livingImage}>
              <img src={item.image} alt={item.title} />
            </div>
          )}

          <div className={styles.livingBody}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
)}

      {location.gastronomy?.items?.length > 0 && (
        <section className={styles.section}>
          <div className={styles.eyebrow}>{location.gastronomy.eyebrow}</div>
          <h2 className={styles.sectionTitle}>{location.gastronomy.title}</h2>

          <div className={styles.cardsGrid}>
            {location.gastronomy.items.map((item: any) => (
              <article className={styles.card} key={item.name}>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{item.name}</h3>
                  <p className={styles.cardText}>
                    {item.category} · {item.price}
                  </p>
                  <p className={styles.cardText}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {location.quickFacts && (
  <section className={styles.quickFactsSection}>
    <div className={styles.quickFactsInner}>
      <div className={styles.quickFactsTitle}>
        {location.quickFacts.title}
      </div>

      <div className={styles.quickFactsGrid}>
        {location.quickFacts.items.map((item: any) => (
          <div className={styles.quickFactItem} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

      {location.gallery?.items?.length > 0 && (
  <section className={styles.gallerySection}>
    <div className={styles.galleryHeader}>
      <div>
        <div className={styles.eyebrow}>{location.gallery.eyebrow}</div>
        {location.gallery.title && (
          <h2 className={styles.sectionTitle}>{location.gallery.title}</h2>
        )}
      </div>
    </div>

    <div className={styles.galleryGrid}>
      {location.gallery.items.map((item: any) => (
        <div className={styles.galleryItem} key={item.image}>
          <img src={item.image} alt={item.alt || ""} />
        </div>
      ))}
    </div>
  </section>
)}

      {location.market && (
        <section className={styles.section}>
          <div className={styles.marketGrid}>
            <div>
              <div className={styles.eyebrow}>{location.market.eyebrow}</div>
              <h2 className={styles.sectionTitle}>{location.market.title}</h2>
              <p className={styles.text}>{location.market.text}</p>
            </div>

            <div className={styles.checklist}>
              {location.market.highlights.map((item: string) => (
                <div className={styles.checkItem} key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {location.cta && (
        <section className={styles.cta}>
          <div className={styles.ctaImage}>
            <img src={location.cta.image} alt={location.cta.title} />
          </div>

          <div className={styles.ctaOverlay} />

          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{location.cta.title}</h2>
            <p className={styles.ctaText}>{location.cta.text}</p>

            <Link href="/" className={styles.ctaButton}>
              {location.cta.buttonLabel}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}