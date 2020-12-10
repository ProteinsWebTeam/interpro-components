const getPolyfillIfNeedBe = async () => {
  if (window.customElements) return;
  return await import(
    '@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce'
  );
};

const main = async () => {
  await getPolyfillIfNeedBe();
  import('data-loader/dist/data-loader.js');
  import('index');
};

main().catch((error) => console.error(error));
