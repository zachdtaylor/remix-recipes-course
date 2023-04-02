export function loader() {
  const data = `
    .my-class {
      color: #abc123;
    }
  `;

  return new Response(data, {
    headers: { "content-type": "text/css" },
  });
}
