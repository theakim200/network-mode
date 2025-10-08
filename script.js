// HTML 요소들 가져오기
const statusPng = document.getElementById('status-png');
const networkSpeedElement = document.querySelector('.network-speed');
const banner = document.querySelector('.banner');
const button = document.querySelector('.button');
const buttonImg = document.querySelector('.button img');
const manifesto = document.querySelector('.manifesto');
const body = document.body;

// PNG 파일 경로
const ONLINE_PNG = 'online.png';
const OFFLINE_PNG = 'offline.png';

// 이미지 프리로딩용 객체들
const onlineImg = new Image();
const offlineImg = new Image();

// 이미지 프리로딩 완료 체크
let imagesLoaded = 0;
let totalImages = 2;

// 이미지 로드 완료 체크 함수
function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded >= totalImages) {
        console.log('모든 이미지 프리로딩 완료');
        // 초기 상태 설정
        updateConnectionStatus();
        // 네트워크 속도 업데이트 시작
        startNetworkSpeedUpdates();
    }
}

// 네트워크 속도 가져오기 함수
function getNetworkSpeed() {
    // 오프라인이면 0 반환
    if (!navigator.onLine) {
        return 0;
    }
    
    // Network Information API 사용
    if (navigator.connection && navigator.connection.downlink) {
        return navigator.connection.downlink;
    }
    
    // API 지원 안 하면 기본값
    return 0;
}

// 네트워크 속도 표시 업데이트
function updateNetworkSpeed() {
    const speed = getNetworkSpeed();
    networkSpeedElement.innerHTML = `${speed.toFixed(2)}<br>Mbps`;
    console.log('네트워크 속도:', speed.toFixed(2), 'Mbps');
}

// 네트워크 속도 업데이트 시작 (2.5초마다)
function startNetworkSpeedUpdates() {
    // 즉시 한 번 업데이트
    updateNetworkSpeed();
    
    // 2.5초마다 반복
    setInterval(updateNetworkSpeed, 2500);
}

// 연결 상태 업데이트 함수
function updateConnectionStatus() {
    if (navigator.onLine) {
        // 온라인 상태
        statusPng.src = onlineImg.src;
        statusPng.alt = 'ONLINE';
        console.log('연결됨: 온라인 상태 - ONLINE PNG 표시');
        updateNetworkSpeed();
    } else {
        // 오프라인 상태
        statusPng.src = offlineImg.src;
        statusPng.alt = 'OFFLINE';
        console.log('연결 끊김: 오프라인 상태 - OFFLINE PNG 표시');
        networkSpeedElement.innerHTML = `0<br>Mbps`;
    }
}

// 이미지 프리로딩 시작
function preloadImages() {
    console.log('이미지 프리로딩 시작...');
    
    // 온라인 이미지 로드
    onlineImg.onload = checkImagesLoaded;
    onlineImg.onerror = () => {
        console.error('온라인 이미지 로드 실패');
        checkImagesLoaded();
    };
    onlineImg.src = ONLINE_PNG;
    
    // 오프라인 이미지 로드
    offlineImg.onload = checkImagesLoaded;
    offlineImg.onerror = () => {
        console.error('오프라인 이미지 로드 실패');
        checkImagesLoaded();
    };
    offlineImg.src = OFFLINE_PNG;
}

// 버튼 랜덤 위치 설정
function setRandomButtonPosition() {
    const buttonSize = 60; // 버튼 크기
    const margin = 20; // 안전 마진
    const topMargin = 80; // 위쪽 마진
    
    const maxWidth = window.innerWidth - buttonSize - margin;
    const maxHeight = window.innerHeight - buttonSize - margin;
    
    const randomX = Math.random() * (maxWidth - margin) + margin;
    const randomY = Math.random() * (maxHeight - topMargin) + topMargin;
    
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
    
    console.log('버튼 위치:', randomX.toFixed(0), randomY.toFixed(0));
}

// 페이지 로드 시 이미지 프리로딩 시작
window.addEventListener('load', () => {
    preloadImages();
    setRandomButtonPosition();
    console.log('페이지 로드 완료, 이미지 프리로딩 중...');
});

// 온라인 상태로 변경될 때
window.addEventListener('online', () => {
    updateConnectionStatus();
    console.log('이벤트: 온라인 상태로 변경됨');
    document.body.style.backgroundColor = "white";
    banner.style.backgroundColor = "#000";
    banner.style.color = "#fff";
    banner.querySelector('p').textContent = "Your network speed is currently...";
    buttonImg.style.transform = "rotate(45deg)";
    button.style.pointerEvents = "none";
});

// 오프라인 상태로 변경될 때
window.addEventListener('offline', () => {
    updateConnectionStatus();
    console.log('이벤트: 오프라인 상태로 변경됨');
    document.body.style.backgroundColor = "black";
    banner.style.backgroundColor = "#fff";
    banner.style.color = "#000";
    banner.querySelector('p').textContent = "Network disconnected";
    buttonImg.style.transform = "rotate(0deg)";
    button.style.pointerEvents = "auto";
});

// 버튼 클릭 이벤트
button.addEventListener('click', (e) => {
    if (!navigator.onLine) {
        e.stopPropagation(); // 이벤트 버블링 방지
        manifesto.classList.toggle('hide');
        console.log('manifesto 토글:', manifesto.classList.contains('hide') ? '숨김' : '보임');
    }
});

// 화면 클릭 시 manifesto 닫기
document.addEventListener('click', (e) => {
    // manifesto가 보이는 상태이고, manifesto 자체를 클릭한 게 아니면 닫기
    if (!manifesto.classList.contains('hide') && !manifesto.contains(e.target)) {
        manifesto.classList.add('hide');
        console.log('manifesto 닫힘');
    }
});

// 디버깅용
console.log('초기 연결 상태:', navigator.onLine ? '온라인' : '오프라인');