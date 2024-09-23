import "./App.css";
import {TonConnectButton} from "@tonconnect/ui-react";
import {useMainContract} from "./hooks/useMainContract";
import {useTonConnect} from "./hooks/useTonConnect";
import {fromNano} from "ton-core";
import WebApp from '@twa-dev/sdk'


function App() {
    const {
        contract_address,
        counter_value,
        recent_sender,
        owner_address,
        contract_balance,
        sendIncrement,
    } = useMainContract();
    const {connected} = useTonConnect();
    const showAlert = () =>
    {
        WebApp.showAlert('Кто здесь!?')
    }
    return (
        <div>
            <TonConnectButton/>

            <div className="container">
                <div>
                    <h3>Contract Data:</h3>
                    <b>Our contract Address:</b>
                    <div className="Hint">{contract_address}</div>
                    <hr/>

                    <b>Our contract Owner:</b>
                    <div className="Hint">{owner_address?.toString()}</div>
                    <hr/>

                    {contract_balance && (
                        <>
                            <b>Our contract Balance:</b>
                            <div className="Hint">{fromNano(contract_balance)}</div>
                            <hr/>
                        </>
                    )}

                    {recent_sender && (
                        <>
                            <b>Recent sender:</b>
                            <div className="Hint">{recent_sender.toString()}</div>
                            <hr/>
                        </>
                    )}

                    <>
                        <b>Counter Value:</b>
                        <div>{counter_value ?? "Loading..."}</div>
                    </>
                </div>
                <a
                    onClick={() => {
                        showAlert();
                    }}
                >
                    Show Alert
                </a>
                <div>
                    <h3>Contract actions: </h3>
                    {connected ? (
                        <>
                            <p>Increment contract balance by 1 TON, with 0.05 TON as a comission</p>
                            <button onClick={sendIncrement}>Increment</button>
                            <hr/>

                        </>
                    ) : (
                        <p>Connect wallet to start action</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
