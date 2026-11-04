// The sidebar shared by every top-level page. It is written into the page while it loads,
// where this script is included, so it is in place before the page first appears.
(() => {
  const page = path => path.replace(/^\.\/$/, "").replace(/\.html$/, "") || "index";
  const here = page(location.pathname.split("/").pop());
  document.currentScript.insertAdjacentHTML("afterend", `
<aside>
  <h1><a href="./">Jonas G. S. Lunde</a></h1>
  <p class="who">Postdoctoral Researcher,<br>Institute of Theoretical Astrophysics,<br>University of Oslo<br><a href="mailto:j.g.s.lunde@astro.uio.no">j.g.s.lunde@astro.uio.no</a></p>
  <nav>
    <a href="./">About me</a>
    <a href="side-projects">Side projects</a>
    <a href="cv">CV</a>
    <a href="publications">Publications</a>
  </nav>
  <div class="ext">
    <h2>External links</h2>
    <a href="https://github.com/jgslunde" target="_blank" rel="noopener">GitHub</a>
    <a href="https://orcid.org/0000-0002-7091-8779" target="_blank" rel="noopener">ORCID</a>
    <a href="https://www.linkedin.com/in/j-g-s-lunde/" target="_blank" rel="noopener">LinkedIn</a>
    <a href="https://scholar.google.com/citations?user=oaRBZ9kAAAAJ" target="_blank" rel="noopener">Google Scholar</a>
    <a href="https://scixplorer.org/search/fq=%7B!type%3Daqp%20v%3D%24fq_database%7D&fq_database=(database%3Aastronomy%20OR%20database%3Aphysics)&q=(%3Dauthor%3A%22Lunde%2C%20J.%20G.%20S.%22%20OR%20%3Dauthor%3A%22Lunde%2C%20Jonas%20G.%20S.%22%20OR%20%3Dauthor%3A%22Lunde%2C%20Jonas%20Gahr%20Sturtzel%22%20OR%20%3Dauthor%3A%22Gahr%20Sturtzel%20Lunde%2C%20Jonas%22%20OR%20%3Dauthor%3A%22Sturtzel%20Lunde%2C%20Jonas%20Gahr%22%20OR%20orcid%3A0000-0002-7091-8779)&sort=date%20desc%2C%20bibcode%20desc&p_=0" target="_blank" rel="noopener">SciX</a>
    <a href="https://arxiv.org/a/gslunde_j_1.html" target="_blank" rel="noopener">arXiv</a>
    <a href="https://www.mn.uio.no/astro/english/people/aca/jonassl/" target="_blank" rel="noopener">University of Oslo</a>
  </div>
</aside>`);
  for (const a of document.querySelectorAll("aside nav a"))
    if (page(a.getAttribute("href")) === here) a.setAttribute("aria-current", "page");
})();
