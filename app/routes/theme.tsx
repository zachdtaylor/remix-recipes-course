export function loader() {
  const data = `
    :root {
      --color-primary: #00743e;
      --color-primary-light: #4c9d77;
    }
  `;

  return new Response(data, {
    headers: { "content-type": "text/css" },
  });
}
