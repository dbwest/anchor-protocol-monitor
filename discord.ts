import fetch from 'node-fetch';

interface DiscordProps {
    balance: string;
    lastBalance: string;
}

export const sendWebhook = async (props: DiscordProps) => {
    const webhook = process.env.WEBHOOK;
    if(!webhook) throw new Error(`Undefined .env value: 'WEBHOOK'`);
    const diff = parseFloat(props.balance) - parseFloat(props.lastBalance);
    console.info(`Difference: ${diff}`);
    const change = (parseFloat(props.balance) / parseFloat(props.lastBalance)) * 100;
    console.info(`Change: ${change}`);
    const data = JSON.stringify({
        "content": `${process.env.ROLE ? `<@${process.env.ROLE}> ${props.balance} aUST` : ''}`,
        "embeds": [
            {
                "title": "BALANCE UPDATE 💰", "color": 7340287,
                "fields": [
                    {
                        "name": "Balance","value": `${props.balance} aUST`,"inline": true
                    },
                    {
                        "name": "Yesterday 🗓","value": `${props.lastBalance} aUST`,"inline": true
                    },
                    {
                        "name": "Difference ➖","value": `+${diff.toFixed(5)} aUST`,"inline": true
                    },
                    {
                        "name": "Change 📈","value": `${change.toFixed(2)}%`,"inline": true
                    },
                ],
                "footer": {  "text": "Anchor Protocol" }, "timestamp": new Date().toISOString()
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: data
    };
    await fetch(webhook, requestOptions);
}