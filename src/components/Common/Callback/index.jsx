export default function Callback() {
  const code = window.location.toString().split("code=")[1].split("&scope=")[0];
  localStorage.setItem("code", code);
  return window.top.close();
}
