import Alert from "sweetalert2";
import { Reaction, i18next } from "/client/api";

export default {

  /**
   * Open the email settings menu
   * @return {Boolean} returns true if action view toggled
   */
  toggleSettings() {
    Reaction.showActionView({
      label: "Email Settings",
      template: "emailSettings"
    });
    return true;
  },

  /**
   * Save email settings
   * @param {Object} settings - object of mail provider settings
   * @param {Function} callback - optional callback
   * @return {Boolean} returns true if all fields provided and update method called
   */
  saveSettings(settings, callback) {
    const { service, host, port, user, password } = settings;

    if (!service) {
      Alert("Error", "Please choose a mail provider service", "error");
      return callback();
    }

    if (service !== "custom" && (!user || !password)) {
      Alert("Error", `SMTP user and password are required for ${service}`, "error");
      return callback();
    }

    if (service === "custom" && (!host || !port || !user || !password)) {
      Alert("Error", "All fields are required for a custom service!", "error");
      return callback();
    }

    // make sure port is a Number
    settings.port = Number(settings.port);

    if (isNaN(settings.port)) {
      Alert("Error", "The port must be a number!", "error");
      return callback();
    }

    const save = () => {
      Meteor.call("email/saveSettings", settings, (err) => {
        if (err) {
          return Alert("Error",
          `${i18next.t("shopSettings.shopMailSettingsFailed")} ${err.reason}`,
          "error");
        }
        return Alert("Success!", "Mail settings saved.", "success");
      });
    };

    // check if the settings work first
    Meteor.call("email/verifySettings", settings, (error) => {
      callback();
      // if the connection fails
      if (error) {
        Alert({
          title: "Connection failed!",
          text: "Do you want to save the settings anyway?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Save"
        }).then(() => save()).catch(() => true);
      } else {
        save();
      }
    });

    return true;
  }
};
