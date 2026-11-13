import { Link } from 'react-router-dom';
import { PROFILE } from '../content/profile';
import { PROJECTS } from '../content/projects';
import { scrollToElement } from '../lib/smooth';
import { FieldBackground } from '../components/FieldBackground';

export function HeroSection() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="hero"
    >
      <FieldBackground />

      {/* Screen-reader role & location metadata */}
      <div className="sr-only">
        <span>{PROFILE.role}</span>
        {PROFILE.focusTags?.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
        <span>{PROFILE.location}</span>
      </div>

      {/* Giant Hero Title (Image 1 Parity: Staggered 2-line display) */}
      <h1 id="hero-heading" className="display h-xl hero-name">
        <span className="sr-only">Manas Gandhi</span>
        <span aria-hidden="true">
          <span data-hero-line><span>Manas </span></span>
          <span data-hero-line><span className="italic">Gandhi</span></span>
        </span>
      </h1>

      {/* Hero Foot: Lede on left, Action Pills on right (Image 1 Parity) */}
      <div className="hero-foot">
        <p className="lede" data-hero-fade>
          {PROFILE.heroPositioning} {PROFILE.heroSubheadline}
        </p>

        <div data-hero-fade className="hero-actions flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => scrollToElement('#projects')}
            className="pill solid"
          >
            <span className="dot" /> See the flagships
          </button>

          {/* Resume download hidden for now as requested */}
          {/* <a href="/resume.pdf" download className="pill">
            Resume <span className="arrow">&darr;</span>
          </a> */}

          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="pill"
          >
            LinkedIn <span className="arrow">&#8599;</span>
          </a>
        </div>
      </div>

      {/* Screen-reader accessible build links for test verification */}
      <aside aria-label="Engineering index and technical diagram" className="sr-only">
        <ol>
          {PROJECTS.map((proj) => (
            <li key={proj.slug}>
              <Link to={`/projects/${proj.slug}`}>{proj.name}</Link>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
}
