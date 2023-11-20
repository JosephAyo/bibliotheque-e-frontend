export const iff = (condition, then, otherwise) => (condition ? then : otherwise);

export const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};
