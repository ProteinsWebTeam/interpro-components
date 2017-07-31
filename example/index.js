const getPolyfillIfNeedBe = async () => {
  if (window.customElements) return;
  return await import('@webcomponents/webcomponentsjs/webcomponents-sd-ce');
};

const main = async () => {
  await getPolyfillIfNeedBe();
  import('data-loader/src/index');
  import('index');
};

main().catch(error => console.error(error));
