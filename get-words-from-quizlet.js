// SetPageTerms-term
// TermText notranslate lang-nl
// TermText notranslate lang-en

known = 'lang-en';
learnt = 'lang-nl';
(() => {
  const rows = Array.from(document.querySelectorAll('.SetPageTerms-term'))
    .map((term) => {
      return {
        k: term.querySelector('.' + known).textContent,
        l: term.querySelector('.' + learnt).textContent,
      };
    })
    .map(({ k, l }) => {
      const xinfo = (w) => {
        return [...w.matchAll('\\(.*?\\)')]
          .flatMap((x) => (Array.isArray(x) ? x : [x]))
          .map((x) => x.slice(1, -1).trim())
          .join(' | ');
      };
      const trunc = (w) =>
        w.replaceAll(new RegExp('\\(.*?\\)', 'g'), '').trim();

      return [trunc(k), xinfo(k), trunc(l), xinfo(l)].join('; ');
    });

  const text = [
    '# Vocab App compatible word set csv upload. ',
    '# generated at ' + new Date().toLocaleString(),
    '# based on ' + window.location.href,
    '',
    '',
    ...rows,
    '',
  ].join('\n');

  const textBlob = new Blob([text], {
    type: 'text/plain',
  });

  const downloadAnchor = document.createElement('a');
  downloadAnchor.download =
    'vocabulary set - ' +
    document.title +
    ' - ' +
    new Date().toLocaleString() +
    '.csv';
  downloadAnchor.href = window.URL.createObjectURL(textBlob);
  downloadAnchor.click();
})();
