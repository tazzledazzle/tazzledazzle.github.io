/** @type {import('@lhci/cli').LHCI.ServerCommand.Options} */
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:4321/",
        "http://localhost:4321/about/",
        "http://localhost:4321/work/",
        "http://localhost:4321/career/",
        "http://localhost:4321/blog/",
        "http://localhost:4321/2024/11/08/kotlin-cheatsheet/"
      ],
      numberOfRuns: 1,
      settings: {
        formFactor: "mobile",
        throttlingMethod: "simulate",
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        screenEmulation: {
          mobile: true,
          width: 412,
          height: 823,
          deviceScaleFactor: 2.625,
          disabled: false
        }
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
