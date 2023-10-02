import React, {useContext} from "react"
import { ProfileContext } from "../../../services/profile/profile.context";

import QRCode from "react-qr-code"


export const GenerateComponent = () => {
    const {profile} = useContext(ProfileContext);

    return (
        <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={profile.family}
            viewBox={`0 0 256 256`}
        />
    )
}