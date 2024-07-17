// Инициализация TonConnect
const tonConnect = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://YOUR_DOMAIN.com/tonconnect-manifest.json' // Укажите здесь URL манифеста
});

// Функция для получения адреса кошелька пользователя
async function getUserConnectedWallet(tgId) {
    const response = await fetch(`/user_connected_wallet?tgId=${tgId}`);
    const data = await response.json();
    return data.walletAddress;
}

// Функция для подключения кошелька
async function connectWallet(userId) {
    const walletConnectionSource = {
        universalLink: 'https://app.tonkeeper.com/ton-connect',
        bridgeUrl: 'https://bridge.tonapi.io/bridge'
    };

    try {
        const universalLink = await tonConnect.connect(walletConnectionSource);
        // Редирект с параметром connected_successful=true
        const redirectUrl = `https://pokerjack.space/static/index.html?connected_successful=true&userId=${userId}`;
        window.location.href = universalLink + "&redirect_url=" + encodeURIComponent(redirectUrl);
    } catch (error) {
        console.error('Ошибка подключения кошелька:', error);
    }
}

// Функция для создания кнопки Connect и обработки клика
function createConnectButton(userId) {
    const connectButton = document.createElement('button');
    connectButton.innerText = 'Connect Wallet';
    connectButton.addEventListener('click', () => connectWallet(userId));
    document.body.appendChild(connectButton);
}

// Функция для обработки успешного подключения
async function handleSuccessfulConnection(userId, walletAddress) {
    try {
        // Отправка POST-запроса на бэкенд с адресом кошелька
        await fetch('/connect_wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                walletAddress
            })
        });

        // Здесь можно добавить логику отображения успешного сообщения или другого UI
        console.log(`Кошелек успешно привязан: ${walletAddress}`);
    } catch (error) {
        console.error('Ошибка обработки успешного подключения:', error);
    }
}

// Основная функция инициализации
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const connectedSuccessful = urlParams.get('connected_successful');
    const userId = urlParams.get('userId');
    const tgId = Telegram.WebApp.initDataUnsafe.user.id;

    if (connectedSuccessful && userId) {
        const wallet = tonConnect.getWallet();
        if (wallet) {
            const walletAddress = wallet.account.address;
            await handleSuccessfulConnection(userId, walletAddress);
        }
    } else {
        // Получаем адрес кошелька пользователя
        const existingWalletAddress = await getUserConnectedWallet(tgId);

        if (!existingWalletAddress) {
            createConnectButton(tgId);
        } else {
            // Если кошелек уже привязан, можно вывести сообщение или другие элементы UI
            console.log(`Кошелек уже привязан: ${existingWalletAddress}`);
        }
    }
}

// Запускаем инициализацию
document.getElementById("test-connect-button").addEventListener("click", ()=> init());
