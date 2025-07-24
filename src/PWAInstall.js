import React from "react";
;
function PWAInstall() {
  const [open, setOpen] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);

  //   let deferredPrompt;
  window.onload = () => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.

      // Update UI notify the user they can install the PWA
      // See if the app is already installed, in that case, do nothing
      if (
        (window.matchMedia &&
          window.matchMedia("(display-mode: standalone)").matches) ||
        window.navigator.standalone === true
      ) {
        console.log("Already install");
        return false;
      }
      //   deferredPrompt = e;
      setDeferredPrompt(e);
      setOpen(true);
    });
  };

  const installApp = (event) => {
    // Hide the app provided install promotion
    //   hideMyInstallPromotion();
    // Show the install prompt
    if (deferredPrompt) deferredPrompt.prompt();
    else {
      console.log("No eligible to install");
      return;
    }
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        setOpen(false);
      }
    });
  };
  const closeInstaller = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      {open && (
        <React.Fragment>
          <br />
          <br />
          <br />
          <br />
          <div
            position="fixed"
            variant="elevation"
            color="transparent"
          >
            <div >
              <div onClick={installApp} >
                <div >
                  <p>Install covid tracker</p>
                </div>
              </div>
              <img
                onClick={closeInstaller}
                alt="close"
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default PWAInstall;
