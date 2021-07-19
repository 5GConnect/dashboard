<template></template>

<script>
import { executePing } from "@/api/NetworkCommand";
import Console from "console.js";

export default {
  name: "NetworkCommandConsole",
  props: ["ueUrl"],
  data() {
    return {
      sessionIp: null,
      console: new Console(
        {
          hotkey: false,
          caseSensitive: true,
          autoComplete: true,
          defaultHandler: function () {},
          onShow: () => this.onShow(),
          onHide: () => this.onHide(),
        }
      ),
    };
  },
  methods: {
    handlePingCommand(ipAddress) {
      executePing(this.ueUrl, { address: ipAddress, pduSessionIp: this.sessionIp })
        .then(result => this.console.log(result))
        .catch(error => this.console.log(error.response.data));
    },
    toggleConsole(sessionIp) {
      this.sessionIp = sessionIp;
      this.console.toggle("on");
    },
    onHide() {
      this.sessionIp = null;
      this.console.clear();
    },
    onShow() {
      this.console.log("Hello user! Type 'help' to view possible commands or 'exit' to quit");
    },
    handleHelpCommand() {
      let that = this
      return Object.keys(this.console.handlers)
        .map(function (name) {
          return " - " + that.console.handlers[name].cfg.usage;
        })
        .join("\n");
    },
  },
  created() {
    this.console.register(
      "ping",
      (ipAddress) => this.handlePingCommand(ipAddress),
      {
        usage:
          "ping <IPToPing>: execute a ping command from the selected interface to <IPToPing>",
      }
    );
    this.console.register("exit", () => this.console.toggle("off"), {
      usage: "exit: exit from the console",
    });
    this.console.register("help", () => this.handleHelpCommand(), {
      usage: "help: show the allowed commands",
    });
  },
};
</script>
