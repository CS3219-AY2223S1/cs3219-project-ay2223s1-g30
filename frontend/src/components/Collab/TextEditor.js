import { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import { useParams } from "react-router-dom"
import {
    Button,
    ButtonGroup,
} from "@mui/material";


const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

export default function TextEditor() {
    const { id: roomId } = useParams()
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()

    useEffect(() => {
        const s = io("http://localhost:8001")
        setSocket(s)

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== 'user') return
            socket.emit("send-changes", delta)
        }

        quill.on('text-change', handler)

        return () => {
            quill.off('text-change', handler)
        }
    }, [socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return

        const handler = (delta) => {
            quill.updateContents(delta)
        }

        socket.on('receive-changes', handler)

        return () => {
            quill.off('receive-changes', handler)
        }
    }, [socket, quill])

    useEffect(() => {
        if (socket == null || quill == null) return

        socket.once("load-document", document => {
            quill.setContents(document)
            quill.enable()
        })

        socket.emit("get-document", roomId)
    }, [socket, quill, roomId])

    useEffect(() => {
        if (socket == null || quill == null) return

        const INTERVAL_IN_MS = 2000
        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents())
        }, INTERVAL_IN_MS)

        return () => {
            clearInterval(interval)
        }
    }, [socket, quill])

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS }
        })
        q.disable()
        q.setText("Loading...")
        setQuill(q)
    }, [])
    return <div>
        < div className="container" ref={wrapperRef} ></div >
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
                marginBottom: '20px',
            }}>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => {
                    socket.emit("leave-match", sessionStorage.getItem("username"));
                    console.log(sessionStorage.getItem("username"));
                    window.location.replace(`/selection`);
                }}>Leave Room</Button>
            </ButtonGroup>
        </div>
    </div>
}
