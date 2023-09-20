import React, {useContext} from "react"
import { LoginContext } from "../../../services/login/login.context"

import QRCode from "react-qr-code"

export const GenerateComponent = () => {
    const {user} = useContext(LoginContext);

    return (
        <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={user.uid}
            viewBox={`0 0 256 256`}
        />
    )
}