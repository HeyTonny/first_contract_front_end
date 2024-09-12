import {useEffect, useState} from "react";
import {MainContract} from "../contracts/MainContract";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, OpenedContract} from "ton-core";
import {toNano} from "ton-core";
import {useTonConnect} from "./useTonConnect";

export function useMainContract() {

    const {sender} = useTonConnect();
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))
    const client = useTonClient();
    const [contractData, setContractData,] = useState<null | {
        counter_value: number;
        contract_balance: number;
        recent_sender: Address;
        owner_address: Address;
    }>();

    // const [balance, setBalance] = useState<null | number>(0);

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new MainContract(
            Address.parse("EQBCN4A9CqOSCA3Y48m3kw7oS_7XLtGZbEy68J8O1N5xFBLA") // replace with your address from tutorial 2 step 8
        );
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            // setBalance(null)
            const mybalance = await mainContract.getBalance();
            const val = await mainContract.getData();
            setContractData({
                counter_value: val.number,
                contract_balance: mybalance.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address,
            });
            await sleep(30000); // sleep 5 seconds and poll value again
            getValue();
        }
        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString(),
        sendIncrement: () => {
            return mainContract?.sendIncrement(sender, toNano(0.05), 3);
        },
        ...contractData,
        // contract_balance: balance?.valueOf(),
    };
}

// import { useEffect, useState } from "react";
// import { MainContract } from "../contracts/MainContract";
// import { useTonClient } from "./useTonClient";
// import { useAsyncInitialize } from "./useAsyncInitialize";
// import { Address, OpenedContract } from "ton-core";
//
// export function useMainContract() {
//   const client = useTonClient();
//   const [contractData, setContractData] = useState<null | {
//     counter_value: number;
//     recent_sender: Address;
//     owner_address: Address;
//   }>();
//
//   // ! was missing
//   const [balance, setBalance] = useState<null | number>(0);
//
//   const mainContract = useAsyncInitialize(async () => {
//     if (!client) return;
//     const parsedAddress = Address.parse("EQBCN4A9CqOSCA3Y48m3kw7oS_7XLtGZbEy68J8O1N5xFBLA");
//     console.log("file: useMainContract.ts:22 ~ mainContract ~ parsedAddress:", parsedAddress.toString());
//
//
//     const contract = new MainContract(parsedAddress);
//     return client.open(contract) as OpenedContract<MainContract>;
//   }, [client]);
//
//   useEffect(() => {
//     async function getValue() {
//       if (!mainContract) return;
//       setContractData(null);
//       const contractData = await mainContract.getData();
//       const contractBalance = await mainContract.getBalance();
//       setContractData({
//         counter_value: contractData.number,
//         recent_sender: contractData.recent_sender,
//         owner_address: contractData.owner_address,
//       });
//
//       // ! was missing
//       setBalance(contractBalance);
//     }
//
//     getValue();
//   }, [mainContract]);
//
//   return {
//     contract_address: mainContract?.address.toString(),
//     contract_balance: balance,
//     ...contractData,
//   };
// }
