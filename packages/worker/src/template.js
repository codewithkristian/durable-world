const template = `
<style>
  body {
    margin: 1rem;
    font-family: monospace;
  }
</style>
<button id="click">Click me</button>
<p>You can also send a message that the WebSocket server doesn't recognize. This will cause the WebSocket server to return an "error" payload back to the client.</p>
<button id="unknown">Simulate Unknown Message</button>
<p>When you're done clicking, you can close the connection below. Further clicks won't work until you refresh the page.</p>
<button id="close">Close connection</button>
<p id="error" style="color: red;"></p>
<h4>Incoming WebSocket data</h4>
<ul id="events"></ul>
<script>
  let ws
  async function websocket(url) {
    ws = new WebSocket(url)
    if (!ws) {
      throw new Error("server didn't accept ws")
    }
    ws.addEventListener("open", () => {
      console.log('Opened websocket')
    })
    ws.addEventListener("message", ({ data }) => {
      addNewEvent(data)
    })
    ws.addEventListener("close", evt => {
      console.log('Closed websocket')
      console.log(evt)
      const list = document.querySelector("#events")
      list.innerText = ""
      setErrorMessage()
    })
  }
  const url = new URL(window.location)
  url.protocol = "wss"
  url.pathname = "/websocket"
  websocket(url)
  document.querySelector("#click").addEventListener("click", () => {
    ws.send(JSON.stringify({ type: "POSITION_UPDATED", position: "1,2,3" }))
  })
  const addNewEvent = (data) => {
    const list = document.querySelector("#events")
    const item = document.createElement("li")
    item.innerText = data
    list.prepend(item)
  }
  const closeConnection = () => ws.close()
  document.querySelector("#close").addEventListener("click", closeConnection)
  document.querySelector("#unknown").addEventListener("click", () => ws.send("HUH"))
  const setErrorMessage = message => {
    document.querySelector("#error").innerHTML = message ? message : ""
  }
</script>
`

export default () => {
  return new Response(template, {
    headers: {
      'Content-type': 'text/html; charset=utf-8'
    }
  })
}