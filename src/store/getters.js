function filterAndFlattenDnnConfiguration(dnnConfigurationObject) {
    let res = [];
    for (const [key, value] of Object.entries(dnnConfigurationObject)) {
        let qosProfile = value["5gQosProfile"];
        res.push({
            apn: key,
            defaultPduSession: value.pduSessionTypes.defaultSessionType,
            "5qi": qosProfile["5qi"],
            arp: qosProfile.priorityLevel,
            capability: qosProfile.arp.preemptCap,
            vulnerability: qosProfile.arp.preemptVuln,
            sessionAmbrDownlink: value.sessionAmbr.downlink,
            sessionAmbrUplink: value.sessionAmbr.uplink,
        });
    }
    return res;
}

function filterAndFlattenNssai(nssaiList) {
    return nssaiList.flatMap((element) =>
        filterAndFlattenDnnConfiguration(element.dnnConfigurations).map(
            (filteredAndFlattenedDnnConfigurations) =>
            Object.assign({ sst: element.sst, sd: element.sd },
                filteredAndFlattenedDnnConfigurations
            )
        )
    );
}
const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    displayableNSSAIs: state => ueSupi => {
        let nssai = state.activeUEs.data[ueSupi].subscriptionInfo.nssai
        if (nssai) {
            let displayableNSSAIs = filterAndFlattenNssai(
                nssai.defaultSingleNssais.concat(
                    nssai.singleNssais
                )
            );
            return displayableNSSAIs;
        } else {
            return {};
        }
    }
}
export default getters