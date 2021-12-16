import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("wishlist/" + sUser).on("value", (snapshot) => {
        const oItems = snapshot.val();
        if (oItems) {
            const aKeys = Object.keys(oItems);
            $$("#wishlist").html("");
            for (let n = 0; n < aKeys.length; n++) {
                let sCard;
                if (!oItems[aKeys[n]].datePurchased) {
                    sCard = `
                            <div class="card">
                                <div class="card-content card-content-padding">
                                    <div class="card-content card-content-padding">
                                        <img src=${oItems[aKeys[n]].image} style="height:120px"/>
                                    </div>
                                    <div class="card-content card-content-padding">${oItems[aKeys[n]].item}</div>
                                    <div class="card-content card-content-padding">$ ${oItems[aKeys[n]].cost}</div>
                                    <div class="card-content card-content-padding">
                                        <button type="button" id="bought-${n}" class="button" sId=${aKeys[n]}>I bought this</button>
                                    </div>
                                    <div class="card-content card-content-padding">                    
                                        <button type="button" id="delete-${n}" class="button" sId=${aKeys[n]}>I don't need this</button>
                                    </div>
                                </div>
                            </div>
                            `
                } else{
                    sCard =  `<div class="card">
                    <div class="card-content card-content-padding">
                        <div class="card-content card-content-padding">
                            <img src=${oItems[aKeys[n]].imageURL} style="height:120px"/>
                        </div>
                        <div class="card-content card-content-padding strike">${oItems[aKeys[n]].item}</div>
                        <div class="card-content card-content-padding strike">$ ${oItems[aKeys[n]].cost}</div>
                        <div class="card-content card-content-padding">
                            <button type="button" id="bought-${n}" class="button" sId=${aKeys[n]} disabled>I bought this</button>
                        </div>
                        <div class="card-content card-content-padding">                    
                            <button type="button" id="delete-${n}" class="button" sId=${aKeys[n]} disabled>I don't need this</button>
                        </div>
                    </div>
                </div>
                `
                }
                $$("#wishlist").append(sCard);

                $$(`#delete-${n}`).on("click", (e) => {
                    e.preventDefault();
                    const sUser = firebase.auth().currentUser.uid;
                    const sId = e.target.attributes.getNamedItem("sId").value;
                    console.log("wishlist/" + sUser + "/" + sId)
                    firebase.database().ref("wishlist/" + sUser + "/" + sId).remove().then(res => {
                        console.log('res ', res)
                    });
                });

                $$(`#bought-${n}`).on("click", (e) => {
                    e.preventDefault();
                    const sUser = firebase.auth().currentUser.uid;
                    const sId = e.target.attributes.getNamedItem("sId").value;
                    console.log("wishlist/" + sUser + "/" + sId)
                    firebase.database().ref('wishlist/' + sUser + "/" + sId).update({
                        datePurchased: new Date().toISOString().replace(".", "_")
                    });
                });

            }
        }
    });
});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    console.log(oData);
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("wishlist/" + sUser + "/" + sId).set(oData);
    $$("#image").val("")
    $$("#item").val("")
    $$("#cost").val("")
    app.sheet.close(".my-sheet", true);
});