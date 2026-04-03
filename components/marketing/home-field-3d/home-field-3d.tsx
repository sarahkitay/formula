import './home-field-3d.css'

/**
 * Marketing homepage 3D soccer field (CSS-driven perspective + outlines).
 * Styles live in `home-field-3d.css`, scoped with `@scope (.home-field-3d)` so
 * global marketing layout is unaffected.
 */
export function HomeField3DSection() {
  return (
    <section
      id="field-3d"
      className="home-field-3d border-t border-formula-frost/10 bg-formula-deep/25"
      aria-label="Facility field visualization"
    >
      <div className="home-field-3d__stage mx-auto max-w-[min(100%,680px)] px-6 py-16 md:py-20">
        <div className="container act">
          <div className="i act">
            <div className="cont">
              <div className="mf-soccer-field-outlines">
                <div className="gen-bdr">
                  <div className="lines">
                    <div className="line l0 c st" />
                    <div id="l2" className="line c" />
                    <div id="l4" className="line c" />
                    <div id="l6" className="line c" />
                    <div id="l7" className="line" />
                    <div id="l10" className="line c nd" />
                  </div>
                  <div className="left">
                    <div className="s">
                      <div className="goal" />
                    </div>
                  </div>
                  <div className="center">
                    <div className="dot" />
                  </div>
                  <div className="center-glow" />
                  <div className="right">
                    <div className="s">
                      <div className="goal" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="goal-r" />
        </div>
      </div>
    </section>
  )
}
