// ==================================================
// ☁️ Supabase 연결
// ==================================================

const SUPABASE_URL =
    "https://eomgjljpnifgdgwdvyrj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_m0QA0SLiIwa_PNoe812ipg_GP2Fc7h0";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==================================================
// 🔐 관리자 계정
// ==================================================

const ADMIN_UIDS = [
    "eac82b96-dc70-4f3f-afda-7cc26129695c",
    "b923c3dd-cdf9-4a46-afe7-de4672671848"
];

const PROFILE_BUCKET =
    "profile-images";

let isAdmin = false;


// ==================================================
// 현재 데이터
// ==================================================

let profileData = null;

let certifications = [];

let careers = [];


// ==================================================
// 📸 프로필 사진 편집 상태
// ==================================================

let profileCropper = null;

/*
    현재 편집 중인 사진

    hero
    → 상단 대표 사진

    about
    → 소개 영역 사진
*/

let currentCropTarget = null;


/*
    새로 자른 사진 Blob
*/

let heroImageBlob = null;

let aboutImageBlob = null;


/*
    새 사진의 미리보기 URL
*/

let heroPreviewUrl = null;

let aboutPreviewUrl = null;


/*
    기존 사진을 삭제할지 여부
*/

let removeHeroImage = false;

let removeAboutImage = false;


/*
    Cropper 확대 초기 비율
*/

let cropInitialRatio = 1;


// ==================================================
// HTML 요소
// ==================================================


// ==================================================
// 로그인
// ==================================================

const loginButton =
    document.getElementById(
        "loginButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const loginModal =
    document.getElementById(
        "loginModal"
    );

const closeLoginButton =
    document.getElementById(
        "closeLoginButton"
    );

const loginForm =
    document.getElementById(
        "loginForm"
    );

const loginEmail =
    document.getElementById(
        "loginEmail"
    );

const loginPassword =
    document.getElementById(
        "loginPassword"
    );


// ==================================================
// 프로필 기본 정보
// ==================================================

const heroProfileName =
    document.getElementById(
        "heroProfileName"
    );

const heroProfileTitle =
    document.getElementById(
        "heroProfileTitle"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profileTitle =
    document.getElementById(
        "profileTitle"
    );

const profileIntro =
    document.getElementById(
        "profileIntro"
    );

const editProfileButton =
    document.getElementById(
        "editProfileButton"
    );


// ==================================================
// 상단 HERO 사진
// ==================================================

const heroProfileImage =
    document.getElementById(
        "heroProfileImage"
    );

const heroProfileImagePlaceholder =
    document.getElementById(
        "heroProfileImagePlaceholder"
    );


// ==================================================
// 아래 소개 사진
// ==================================================

const aboutProfileImage =
    document.getElementById(
        "aboutProfileImage"
    );

const aboutProfileImagePlaceholder =
    document.getElementById(
        "aboutProfileImagePlaceholder"
    );


// ==================================================
// 프로필 수정 모달
// ==================================================

const profileModal =
    document.getElementById(
        "profileModal"
    );

const closeProfileModalButton =
    document.getElementById(
        "closeProfileModalButton"
    );

const cancelProfileButton =
    document.getElementById(
        "cancelProfileButton"
    );

const profileForm =
    document.getElementById(
        "profileForm"
    );

const profileNameInput =
    document.getElementById(
        "profileNameInput"
    );

const profileTitleInput =
    document.getElementById(
        "profileTitleInput"
    );

const profileIntroInput =
    document.getElementById(
        "profileIntroInput"
    );


// ==================================================
// 상단 사진 관리
// ==================================================

const heroImageInput =
    document.getElementById(
        "heroImageInput"
    );

const heroImagePreview =
    document.getElementById(
        "heroImagePreview"
    );

const heroImageEditPlaceholder =
    document.getElementById(
        "heroImageEditPlaceholder"
    );

const editHeroImageButton =
    document.getElementById(
        "editHeroImageButton"
    );

const removeHeroImageButton =
    document.getElementById(
        "removeHeroImageButton"
    );


// ==================================================
// 소개 사진 관리
// ==================================================

const aboutImageInput =
    document.getElementById(
        "aboutImageInput"
    );

const aboutImagePreview =
    document.getElementById(
        "aboutImagePreview"
    );

const aboutImageEditPlaceholder =
    document.getElementById(
        "aboutImageEditPlaceholder"
    );

const editAboutImageButton =
    document.getElementById(
        "editAboutImageButton"
    );

const removeAboutImageButton =
    document.getElementById(
        "removeAboutImageButton"
    );


// ==================================================
// 프로필 사진 Cropper
// ==================================================

const profileCropModal =
    document.getElementById(
        "profileCropModal"
    );

const profileCropModalTitle =
    document.getElementById(
        "profileCropModalTitle"
    );

const profileCropImage =
    document.getElementById(
        "profileCropImage"
    );

const profileZoomSlider =
    document.getElementById(
        "profileZoomSlider"
    );

const profileRotateLeftButton =
    document.getElementById(
        "profileRotateLeftButton"
    );

const profileRotateRightButton =
    document.getElementById(
        "profileRotateRightButton"
    );

const profileResetCropButton =
    document.getElementById(
        "profileResetCropButton"
    );

const applyProfileCropButton =
    document.getElementById(
        "applyProfileCropButton"
    );

const cancelProfileCropButton =
    document.getElementById(
        "cancelProfileCropButton"
    );

const closeProfileCropModalButton =
    document.getElementById(
        "closeProfileCropModalButton"
    );


// ==================================================
// 자격증
// ==================================================

const certificationList =
    document.getElementById(
        "certificationList"
    );

const certificationEmpty =
    document.getElementById(
        "certificationEmpty"
    );

const addCertificationButton =
    document.getElementById(
        "addCertificationButton"
    );

const certificationModal =
    document.getElementById(
        "certificationModal"
    );

const certificationModalTitle =
    document.getElementById(
        "certificationModalTitle"
    );

const closeCertificationModalButton =
    document.getElementById(
        "closeCertificationModalButton"
    );

const cancelCertificationButton =
    document.getElementById(
        "cancelCertificationButton"
    );

const certificationForm =
    document.getElementById(
        "certificationForm"
    );

const certificationId =
    document.getElementById(
        "certificationId"
    );

const certificationName =
    document.getElementById(
        "certificationName"
    );

const certificationDate =
    document.getElementById(
        "certificationDate"
    );

const certificationOrder =
    document.getElementById(
        "certificationOrder"
    );


// ==================================================
// 경력
// ==================================================

const careerList =
    document.getElementById(
        "careerList"
    );

const careerEmpty =
    document.getElementById(
        "careerEmpty"
    );

const addCareerButton =
    document.getElementById(
        "addCareerButton"
    );

const careerModal =
    document.getElementById(
        "careerModal"
    );

const careerModalTitle =
    document.getElementById(
        "careerModalTitle"
    );

const closeCareerModalButton =
    document.getElementById(
        "closeCareerModalButton"
    );

const cancelCareerButton =
    document.getElementById(
        "cancelCareerButton"
    );

const careerForm =
    document.getElementById(
        "careerForm"
    );

const careerId =
    document.getElementById(
        "careerId"
    );

const careerCompany =
    document.getElementById(
        "careerCompany"
    );

const careerPosition =
    document.getElementById(
        "careerPosition"
    );

const careerStartDate =
    document.getElementById(
        "careerStartDate"
    );

const careerEndDate =
    document.getElementById(
        "careerEndDate"
    );

const careerDescription =
    document.getElementById(
        "careerDescription"
    );

const careerOrder =
    document.getElementById(
        "careerOrder"
    );


// ==================================================
// 토스트
// ==================================================

const toast =
    document.getElementById(
        "toast"
    );

let toastTimer = null;


// ==================================================
// HTML 안전 처리
// ==================================================

function escapeHTML(value = "") {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ==================================================
// 날짜 표시
// ==================================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;
    }

    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(date);
}


// ==================================================
// 경력 기간 표시
// ==================================================

function formatCareerPeriod(
    startDate,
    endDate
) {

    const formatMonth =
        dateString => {

            if (!dateString) {
                return "";
            }

            const [
                year,
                month
            ] =
                dateString.split("-");

            if (!year) {
                return "";
            }

            if (!month) {
                return year;
            }

            return `${year}.${month}`;
        };


    const start =
        formatMonth(
            startDate
        );

    const end =
        endDate
            ? formatMonth(
                endDate
            )
            : "현재";


    if (!start) {

        return endDate
            ? end
            : "재직 중";
    }

    return `${start} ~ ${end}`;
}


// ==================================================
// 자격증 아이콘
// ==================================================

function getCertificationIcon(
    name = ""
) {

    if (name.includes("복어")) {
        return "🐡";
    }

    if (name.includes("떡")) {
        return "🍡";
    }

    if (name.includes("제빵")) {
        return "🥐";
    }

    if (name.includes("제과")) {
        return "🧁";
    }

    if (name.includes("중식")) {
        return "🥟";
    }

    if (name.includes("양식")) {
        return "🍝";
    }

    if (name.includes("일식")) {
        return "🍣";
    }

    if (name.includes("조주")) {
        return "🍹";
    }

    if (name.includes("한식")) {
        return "🍚";
    }

    return "🏅";
}


// ==================================================
// 모달 공통
// ==================================================

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal
        .classList
        .remove("hidden");

    document.body
        .classList
        .add("modal-open");
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal
        .classList
        .add("hidden");

    restoreBodyScroll();
}


function restoreBodyScroll() {

    const modals = [
        loginModal,
        profileModal,
        profileCropModal,
        certificationModal,
        careerModal
    ];

    const anyOpen =
        modals.some(
            modal =>
                modal &&
                !modal.classList.contains(
                    "hidden"
                )
        );

    document.body
        .classList
        .toggle(
            "modal-open",
            anyOpen
        );
}


// ==================================================
// ☁️ 프로필 불러오기
// ==================================================

async function loadProfile() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from("profile")

            .select("*")

            .order(
                "id",
                {
                    ascending: true
                }
            )

            .limit(1)

            .maybeSingle();


    if (error) {

        console.error(
            "프로필 불러오기 실패:",
            error
        );

        showToast(
            "소개 정보를 불러오지 못했어요."
        );

        return;
    }


    profileData =
        data || null;

    renderProfile();
}


// ==================================================
// 프로필 표시
// ==================================================

function renderProfile() {

    const name =
        profileData?.name ||
        "고장금";

    const title =
        profileData?.title ||
        "강사";

    const intro =
        profileData?.intro ||
        "현재 광주제일직업전문학원에서 강사로 활동하고 있습니다.";


    /*
        기존 image_url이 있으면
        상단 사진 임시 호환용으로 사용
    */

    const heroUrl =
        profileData?.hero_image_url ||
        profileData?.image_url ||
        "";

    const aboutUrl =
        profileData?.about_image_url ||
        "";


    heroProfileName.textContent =
        name;

    heroProfileTitle.textContent =
        title;

    profileName.textContent =
        name;

    profileTitle.textContent =
        title;

    profileIntro.textContent =
        intro;


    // --------------------------
    // 상단 사진
    // --------------------------

    if (heroUrl) {

        heroProfileImage.src =
            heroUrl;

        heroProfileImage
            .classList
            .remove("hidden");

        heroProfileImagePlaceholder
            .classList
            .add("hidden");

    } else {

        heroProfileImage.src =
            "";

        heroProfileImage
            .classList
            .add("hidden");

        heroProfileImagePlaceholder
            .classList
            .remove("hidden");
    }


    // --------------------------
    // 소개 사진
    // --------------------------

    if (aboutUrl) {

        aboutProfileImage.src =
            aboutUrl;

        aboutProfileImage
            .classList
            .remove("hidden");

        aboutProfileImagePlaceholder
            .classList
            .add("hidden");

    } else {

        aboutProfileImage.src =
            "";

        aboutProfileImage
            .classList
            .add("hidden");

        aboutProfileImagePlaceholder
            .classList
            .remove("hidden");
    }
}


// ==================================================
// 관리자 프로필 미리보기
// ==================================================

function renderProfileEditPreviews() {

    const heroUrl =
        heroPreviewUrl ||
        profileData?.hero_image_url ||
        profileData?.image_url ||
        "";

    const aboutUrl =
        aboutPreviewUrl ||
        profileData?.about_image_url ||
        "";


    // --------------------------
    // 상단
    // --------------------------

    if (
        heroUrl &&
        !removeHeroImage
    ) {

        heroImagePreview.src =
            heroUrl;

        heroImagePreview
            .classList
            .remove("hidden");

        heroImageEditPlaceholder
            .classList
            .add("hidden");

        editHeroImageButton
            .classList
            .remove("hidden");

        removeHeroImageButton
            .classList
            .remove("hidden");

    } else {

        heroImagePreview.src =
            "";

        heroImagePreview
            .classList
            .add("hidden");

        heroImageEditPlaceholder
            .classList
            .remove("hidden");

        editHeroImageButton
            .classList
            .add("hidden");

        removeHeroImageButton
            .classList
            .add("hidden");
    }


    // --------------------------
    // 소개
    // --------------------------

    if (
        aboutUrl &&
        !removeAboutImage
    ) {

        aboutImagePreview.src =
            aboutUrl;

        aboutImagePreview
            .classList
            .remove("hidden");

        aboutImageEditPlaceholder
            .classList
            .add("hidden");

        editAboutImageButton
            .classList
            .remove("hidden");

        removeAboutImageButton
            .classList
            .remove("hidden");

    } else {

        aboutImagePreview.src =
            "";

        aboutImagePreview
            .classList
            .add("hidden");

        aboutImageEditPlaceholder
            .classList
            .remove("hidden");

        editAboutImageButton
            .classList
            .add("hidden");

        removeAboutImageButton
            .classList
            .add("hidden");
    }
}


// ==================================================
// ✏️ 프로필 수정창 열기
// ==================================================

function openProfileModal() {

    if (!isAdmin) {

        showToast(
            "관리자 로그인이 필요해요."
        );

        return;
    }


    profileNameInput.value =
        profileData?.name ||
        "고장금";

    profileTitleInput.value =
        profileData?.title ||
        "";

    profileIntroInput.value =
        profileData?.intro ||
        "";


    /*
        새 편집 상태 초기화
    */

    heroImageBlob = null;
    aboutImageBlob = null;

    removeHeroImage = false;
    removeAboutImage = false;

    clearObjectUrl(
        "hero"
    );

    clearObjectUrl(
        "about"
    );


    heroImageInput.value =
        "";

    aboutImageInput.value =
        "";


    renderProfileEditPreviews();

    openModal(
        profileModal
    );
}


// ==================================================
// Object URL 정리
// ==================================================

function clearObjectUrl(target) {

    if (
        target === "hero" &&
        heroPreviewUrl
    ) {

        URL.revokeObjectURL(
            heroPreviewUrl
        );

        heroPreviewUrl = null;
    }


    if (
        target === "about" &&
        aboutPreviewUrl
    ) {

        URL.revokeObjectURL(
            aboutPreviewUrl
        );

        aboutPreviewUrl = null;
    }
}


// ==================================================
// 📸 파일 선택
// ==================================================

heroImageInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        openCropperFromFile(
            file,
            "hero"
        );
    }
);


aboutImageInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        openCropperFromFile(
            file,
            "about"
        );
    }
);


// ==================================================
// 파일 검사
// ==================================================

function validateImageFile(file) {

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showToast(
            "이미지 파일만 선택할 수 있어요."
        );

        return false;
    }


    const maxSize =
        10 * 1024 * 1024;


    if (
        file.size >
        maxSize
    ) {

        showToast(
            "사진은 10MB 이하로 선택해주세요."
        );

        return false;
    }


    return true;
}


// ==================================================
// 파일 → Cropper
// ==================================================

function openCropperFromFile(
    file,
    target
) {

    if (
        !validateImageFile(
            file
        )
    ) {

        return;
    }


    const reader =
        new FileReader();


    reader.onload =
        event => {

            openProfileCropper(
                event.target.result,
                target
            );
        };


    reader.readAsDataURL(
        file
    );
}


// ==================================================
// 기존 사진 다시 편집
// ==================================================

editHeroImageButton.addEventListener(
    "click",
    () => {

        const source =
            heroPreviewUrl ||
            profileData?.hero_image_url ||
            profileData?.image_url ||
            "";

        if (!source) {
            return;
        }

        openProfileCropper(
            source,
            "hero"
        );
    }
);


editAboutImageButton.addEventListener(
    "click",
    () => {

        const source =
            aboutPreviewUrl ||
            profileData?.about_image_url ||
            "";

        if (!source) {
            return;
        }

        openProfileCropper(
            source,
            "about"
        );
    }
);


// ==================================================
// Cropper 열기
// ==================================================

function openProfileCropper(
    imageSource,
    target
) {

    currentCropTarget =
        target;


    if (
        profileCropper
    ) {

        profileCropper.destroy();

        profileCropper = null;
    }


    profileZoomSlider.value =
        0;


    profileCropModalTitle.textContent =
        target === "hero"
            ? "상단 대표 사진 편집"
            : "소개 영역 사진 편집";


    /*
        Supabase URL을 편집할 때
        Canvas CORS 문제 예방
    */

    if (
        imageSource.startsWith(
            "http"
        )
    ) {

        profileCropImage.crossOrigin =
            "anonymous";

    } else {

        profileCropImage.removeAttribute(
            "crossorigin"
        );
    }


    profileCropImage.onload =
        () => {

            openModal(
                profileCropModal
            );


            setTimeout(
                () => {

                    profileCropper =
                        new Cropper(
                            profileCropImage,
                            {

                                aspectRatio: 1,

                                viewMode: 1,

                                dragMode: "move",

                                autoCropArea: 0.9,

                                responsive: true,

                                restore: false,

                                guides: true,

                                center: true,

                                highlight: false,

                                background: false,

                                movable: true,

                                rotatable: true,

                                scalable: false,

                                zoomable: true,

                                zoomOnTouch: true,

                                zoomOnWheel: true,

                                cropBoxMovable: false,

                                cropBoxResizable: false,

                                toggleDragModeOnDblclick:
                                    false,

                                ready() {

                                    const imageData =
                                        profileCropper
                                            .getImageData();

                                    cropInitialRatio =
                                        imageData.ratio ||
                                        1;

                                    profileZoomSlider.value =
                                        0;
                                }
                            }
                        );

                },

                50
            );
        };


    /*
        같은 src를 다시 선택해도
        load가 발생하도록 초기화
    */

    profileCropImage.src =
        "";

    setTimeout(
        () => {

            profileCropImage.src =
                imageSource;

        },

        10
    );
}


// ==================================================
// 확대 / 축소
// ==================================================

profileZoomSlider.addEventListener(
    "input",
    () => {

        if (!profileCropper) {
            return;
        }


        const sliderValue =
            Number(
                profileZoomSlider.value
            );


        /*
            0 → 기본 크기
            100 → 기본 크기의 약 3배
        */

        const multiplier =
            1 +
            sliderValue / 50;


        profileCropper.zoomTo(
            cropInitialRatio *
            multiplier
        );
    }
);


// ==================================================
// 회전
// ==================================================

profileRotateLeftButton.addEventListener(
    "click",
    () => {

        profileCropper?.rotate(
            -90
        );
    }
);


profileRotateRightButton.addEventListener(
    "click",
    () => {

        profileCropper?.rotate(
            90
        );
    }
);


// ==================================================
// Cropper 초기화
// ==================================================

profileResetCropButton.addEventListener(
    "click",
    () => {

        if (!profileCropper) {
            return;
        }


        profileCropper.reset();

        profileZoomSlider.value =
            0;


        setTimeout(
            () => {

                const imageData =
                    profileCropper
                        .getImageData();

                cropInitialRatio =
                    imageData.ratio ||
                    1;

            },

            20
        );
    }
);


// ==================================================
// 1:1 자르기 완료
// ==================================================

applyProfileCropButton.addEventListener(
    "click",
    () => {

        if (
            !profileCropper ||
            !currentCropTarget
        ) {

            return;
        }


        const canvas =
            profileCropper
                .getCroppedCanvas(
                    {

                        width: 1000,

                        height: 1000,

                        imageSmoothingEnabled:
                            true,

                        imageSmoothingQuality:
                            "high"

                    }
                );


        if (!canvas) {

            showToast(
                "사진을 편집하지 못했어요."
            );

            return;
        }


        canvas.toBlob(
            blob => {

                if (!blob) {

                    showToast(
                        "사진을 처리하지 못했어요."
                    );

                    return;
                }


                if (
                    currentCropTarget ===
                    "hero"
                ) {

                    heroImageBlob =
                        blob;

                    removeHeroImage =
                        false;

                    clearObjectUrl(
                        "hero"
                    );

                    heroPreviewUrl =
                        URL.createObjectURL(
                            blob
                        );

                } else {

                    aboutImageBlob =
                        blob;

                    removeAboutImage =
                        false;

                    clearObjectUrl(
                        "about"
                    );

                    aboutPreviewUrl =
                        URL.createObjectURL(
                            blob
                        );
                }


                renderProfileEditPreviews();


                closeProfileCropper();


                showToast(
                    "사진 편집이 완료됐어요 ✂️"
                );
            },

            "image/webp",

            0.9
        );
    }
);


// ==================================================
// Cropper 닫기
// ==================================================

function closeProfileCropper() {

    if (
        profileCropper
    ) {

        profileCropper.destroy();

        profileCropper = null;
    }


    currentCropTarget =
        null;


    profileCropImage.src =
        "";


    closeModal(
        profileCropModal
    );
}


closeProfileCropModalButton.addEventListener(
    "click",
    closeProfileCropper
);


cancelProfileCropButton.addEventListener(
    "click",
    closeProfileCropper
);


// ==================================================
// 사진 삭제 예약
// ==================================================

removeHeroImageButton.addEventListener(
    "click",
    () => {

        const answer =
            confirm(
                "상단 대표 사진을 삭제할까요?"
            );

        if (!answer) {
            return;
        }


        heroImageBlob =
            null;

        clearObjectUrl(
            "hero"
        );

        removeHeroImage =
            true;

        heroImageInput.value =
            "";

        renderProfileEditPreviews();
    }
);


removeAboutImageButton.addEventListener(
    "click",
    () => {

        const answer =
            confirm(
                "소개 영역 사진을 삭제할까요?"
            );

        if (!answer) {
            return;
        }


        aboutImageBlob =
            null;

        clearObjectUrl(
            "about"
        );

        removeAboutImage =
            true;

        aboutImageInput.value =
            "";

        renderProfileEditPreviews();
    }
);


// ==================================================
// ☁️ Storage 사진 업로드
// ==================================================

async function uploadProfileImage(
    blob,
    target
) {

    const folder =
        target === "hero"
            ? "hero"
            : "about";


    const randomName =
        `${Date.now()}-${crypto.randomUUID()}.webp`;


    const filePath =
        `${folder}/${randomName}`;


    const {
        error
    } =
        await supabaseClient

            .storage

            .from(
                PROFILE_BUCKET
            )

            .upload(
                filePath,
                blob,
                {

                    contentType:
                        "image/webp",

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (error) {

        console.error(
            "프로필 사진 업로드 실패:",
            error
        );

        throw error;
    }


    const {
        data
    } =
        supabaseClient

            .storage

            .from(
                PROFILE_BUCKET
            )

            .getPublicUrl(
                filePath
            );


    return {
        publicUrl:
            data.publicUrl,

        filePath
    };
}


// ==================================================
// Storage URL → 파일 경로
// ==================================================

function getProfileStoragePath(
    publicUrl
) {

    if (!publicUrl) {
        return null;
    }


    const marker =
        `/storage/v1/object/public/${PROFILE_BUCKET}/`;


    const index =
        publicUrl.indexOf(
            marker
        );


    if (index === -1) {
        return null;
    }


    const path =
        publicUrl.substring(
            index +
            marker.length
        );


    try {

        return decodeURIComponent(
            path.split("?")[0]
        );

    } catch {

        return path.split("?")[0];
    }
}


// ==================================================
// 기존 Storage 사진 삭제
// ==================================================

async function deleteStoredProfileImage(
    publicUrl
) {

    const path =
        getProfileStoragePath(
            publicUrl
        );


    if (!path) {

        /*
            예전 image_url이 외부 URL인 경우
            Storage 파일이 아니므로 삭제하지 않음
        */

        return;
    }


    const {
        error
    } =
        await supabaseClient

            .storage

            .from(
                PROFILE_BUCKET
            )

            .remove(
                [
                    path
                ]
            );


    if (error) {

        console.error(
            "기존 프로필 사진 삭제 실패:",
            error
        );
    }
}


// ==================================================
// 💾 프로필 저장
// ==================================================

profileForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!isAdmin) {

            showToast(
                "관리자만 수정할 수 있어요."
            );

            return;
        }


        if (!profileData?.id) {

            showToast(
                "프로필 데이터를 찾을 수 없어요."
            );

            return;
        }


        /*
            현재 저장된 주소
        */

        const oldHeroUrl =
            profileData
                ?.hero_image_url ||
            profileData
                ?.image_url ||
            null;


        const oldAboutUrl =
            profileData
                ?.about_image_url ||
            null;


        let newHeroUrl =
            profileData
                ?.hero_image_url ||
            profileData
                ?.image_url ||
            null;


        let newAboutUrl =
            profileData
                ?.about_image_url ||
            null;


        let uploadedHero =
            null;

        let uploadedAbout =
            null;


        try {

            // --------------------------
            // 상단 새 사진 업로드
            // --------------------------

            if (heroImageBlob) {

                uploadedHero =
                    await uploadProfileImage(
                        heroImageBlob,
                        "hero"
                    );

                newHeroUrl =
                    uploadedHero.publicUrl;
            }


            // --------------------------
            // 소개 새 사진 업로드
            // --------------------------

            if (aboutImageBlob) {

                uploadedAbout =
                    await uploadProfileImage(
                        aboutImageBlob,
                        "about"
                    );

                newAboutUrl =
                    uploadedAbout.publicUrl;
            }


            // --------------------------
            // 삭제 예약
            // --------------------------

            if (removeHeroImage) {

                newHeroUrl =
                    null;
            }


            if (removeAboutImage) {

                newAboutUrl =
                    null;
            }


            // --------------------------
            // profile 테이블 저장
            // --------------------------

            const profileUpdate = {

                name:
                    profileNameInput
                        .value
                        .trim(),

                title:
                    profileTitleInput
                        .value
                        .trim() ||
                    null,

                intro:
                    profileIntroInput
                        .value
                        .trim() ||
                    null,

                hero_image_url:
                    newHeroUrl,

                about_image_url:
                    newAboutUrl
            };


            const {
                error
            } =
                await supabaseClient

                    .from(
                        "profile"
                    )

                    .update(
                        profileUpdate
                    )

                    .eq(
                        "id",
                        profileData.id
                    );


            if (error) {

                console.error(
                    "프로필 수정 실패:",
                    error
                );


                /*
                    DB 저장에 실패했으면
                    방금 새로 올린 사진은 삭제
                */

                if (
                    uploadedHero?.publicUrl
                ) {

                    await deleteStoredProfileImage(
                        uploadedHero.publicUrl
                    );
                }


                if (
                    uploadedAbout?.publicUrl
                ) {

                    await deleteStoredProfileImage(
                        uploadedAbout.publicUrl
                    );
                }


                showToast(
                    "소개를 수정하지 못했어요."
                );

                return;
            }


            // --------------------------
            // DB 저장 성공 후
            // 기존 사진 정리
            // --------------------------

            if (
                oldHeroUrl &&
                (
                    heroImageBlob ||
                    removeHeroImage
                ) &&
                oldHeroUrl !==
                    newHeroUrl
            ) {

                await deleteStoredProfileImage(
                    oldHeroUrl
                );
            }


            if (
                oldAboutUrl &&
                (
                    aboutImageBlob ||
                    removeAboutImage
                ) &&
                oldAboutUrl !==
                    newAboutUrl
            ) {

                await deleteStoredProfileImage(
                    oldAboutUrl
                );
            }


            // --------------------------
            // 임시 데이터 초기화
            // --------------------------

            heroImageBlob =
                null;

            aboutImageBlob =
                null;

            removeHeroImage =
                false;

            removeAboutImage =
                false;

            clearObjectUrl(
                "hero"
            );

            clearObjectUrl(
                "about"
            );


            closeModal(
                profileModal
            );


            showToast(
                "소개를 수정했어요 ✨"
            );


            await loadProfile();


        } catch (error) {

            console.error(
                "프로필 저장 중 오류:",
                error
            );


            showToast(
                "사진 저장 중 오류가 발생했어요."
            );
        }
    }
);


// ==================================================
// ☁️ 자격증 불러오기
// ==================================================

async function loadCertifications() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "certifications"
            )

            .select("*")

            .order(
                "sort_order",
                {
                    ascending: true,
                    nullsFirst: false
                }
            )

            .order(
                "id",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "자격증 불러오기 실패:",
            error
        );

        showToast(
            "자격증 정보를 불러오지 못했어요."
        );

        return;
    }


    certifications =
        data || [];

    renderCertifications();
}


// ==================================================
// 자격증 표시
// ==================================================

function renderCertifications() {

    certificationList.innerHTML =
        "";


    if (
        certifications.length === 0
    ) {

        certificationEmpty
            .classList
            .remove("hidden");

        return;
    }


    certificationEmpty
        .classList
        .add("hidden");


    certifications.forEach(
        certification => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "certification-card";


            const dateText =
                certification
                    .acquired_date

                    ? `취득 ${formatDate(
                        certification
                            .acquired_date
                    )}`

                    : "보유 자격";


            card.innerHTML = `

                <div
                    class="certification-icon"
                >
                    ${
                        getCertificationIcon(
                            certification.name
                        )
                    }
                </div>


                <h3>
                    ${
                        escapeHTML(
                            certification.name
                        )
                    }
                </h3>


                <p
                    class="certification-date"
                >
                    ${
                        escapeHTML(
                            dateText
                        )
                    }
                </p>


                ${
                    isAdmin

                        ? `
                            <div
                                class="card-admin-buttons"
                            >

                                <button
                                    type="button"
                                    class="card-edit-button"
                                    data-action="edit-certification"
                                    data-id="${certification.id}"
                                >
                                    수정
                                </button>


                                <button
                                    type="button"
                                    class="card-delete-button"
                                    data-action="delete-certification"
                                    data-id="${certification.id}"
                                >
                                    삭제
                                </button>

                            </div>
                        `

                        : ""
                }

            `;


            certificationList
                .appendChild(
                    card
                );
        }
    );
}


// ==================================================
// 자격증 추가
// ==================================================

function openNewCertification() {

    if (!isAdmin) {

        showToast(
            "관리자 로그인이 필요해요."
        );

        return;
    }


    certificationForm.reset();

    certificationId.value =
        "";

    certificationModalTitle
        .textContent =
        "자격증 추가";

    openModal(
        certificationModal
    );
}


// ==================================================
// 자격증 수정
// ==================================================

function editCertification(id) {

    if (!isAdmin) {
        return;
    }


    const certification =
        certifications.find(
            item =>
                item.id === id
        );


    if (!certification) {
        return;
    }


    certificationId.value =
        certification.id;

    certificationName.value =
        certification.name ||
        "";

    certificationDate.value =
        certification
            .acquired_date ||
        "";

    certificationOrder.value =
        certification
            .sort_order ??
        "";

    certificationModalTitle
        .textContent =
        "자격증 수정";

    openModal(
        certificationModal
    );
}


// ==================================================
// 자격증 저장
// ==================================================

certificationForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!isAdmin) {

            showToast(
                "관리자만 저장할 수 있어요."
            );

            return;
        }


        const id =
            certificationId.value;


        const data = {

            name:
                certificationName
                    .value
                    .trim(),

            acquired_date:
                certificationDate
                    .value ||
                null,

            sort_order:
                certificationOrder
                    .value === ""

                    ? null

                    : Number(
                        certificationOrder
                            .value
                    )
        };


        let error;


        if (id) {

            const result =
                await supabaseClient

                    .from(
                        "certifications"
                    )

                    .update(data)

                    .eq(
                        "id",
                        Number(id)
                    );


            error =
                result.error;

        } else {

            const result =
                await supabaseClient

                    .from(
                        "certifications"
                    )

                    .insert(data);


            error =
                result.error;
        }


        if (error) {

            console.error(
                "자격증 저장 실패:",
                error
            );


            if (
                error.code ===
                "23505"
            ) {

                showToast(
                    "이미 등록된 자격증이에요."
                );

            } else {

                showToast(
                    "자격증을 저장하지 못했어요."
                );
            }


            return;
        }


        closeModal(
            certificationModal
        );


        showToast(
            id
                ? "자격증을 수정했어요 ✨"
                : "자격증을 추가했어요 🏅"
        );


        await loadCertifications();
    }
);


// ==================================================
// 자격증 삭제
// ==================================================

async function deleteCertification(
    id
) {

    if (!isAdmin) {
        return;
    }


    const certification =
        certifications.find(
            item =>
                item.id === id
        );


    if (!certification) {
        return;
    }


    const answer =
        confirm(
            `"${certification.name}" 자격증을 삭제할까요?`
        );


    if (!answer) {
        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from(
                "certifications"
            )

            .delete()

            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "자격증 삭제 실패:",
            error
        );


        showToast(
            "자격증을 삭제하지 못했어요."
        );

        return;
    }


    showToast(
        "자격증을 삭제했어요."
    );


    await loadCertifications();
}


// ==================================================
// 자격증 카드 버튼
// ==================================================

certificationList
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;


            if (
                action ===
                "edit-certification"
            ) {

                editCertification(
                    id
                );
            }


            if (
                action ===
                "delete-certification"
            ) {

                deleteCertification(
                    id
                );
            }
        }
    );


// ==================================================
// ☁️ 경력 불러오기
// ==================================================

async function loadCareers() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from("careers")

            .select("*")

            .order(
                "sort_order",
                {
                    ascending: true,
                    nullsFirst: false
                }
            )

            .order(
                "start_date",
                {
                    ascending: false,
                    nullsFirst: false
                }
            )

            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "경력 불러오기 실패:",
            error
        );

        showToast(
            "경력 정보를 불러오지 못했어요."
        );

        return;
    }


    careers =
        data || [];

    renderCareers();
}


// ==================================================
// 경력 표시
// ==================================================

function renderCareers() {

    careerList.innerHTML =
        "";


    if (
        careers.length === 0
    ) {

        careerEmpty
            .classList
            .remove("hidden");

        return;
    }


    careerEmpty
        .classList
        .add("hidden");


    careers.forEach(
        career => {

            const wrapper =
                document.createElement(
                    "article"
                );


            wrapper.className =
                "career-card";


            const period =
                formatCareerPeriod(
                    career.start_date,
                    career.end_date
                );


            wrapper.innerHTML = `

                <div
                    class="career-dot"
                >
                </div>


                <div
                    class="career-card-inner"
                >

                    <p
                        class="career-period"
                    >
                        ${
                            escapeHTML(
                                period
                            )
                        }
                    </p>


                    <h3>
                        ${
                            escapeHTML(
                                career.company ||
                                ""
                            )
                        }
                    </h3>


                    <p
                        class="career-position"
                    >
                        ${
                            escapeHTML(
                                career.position ||
                                ""
                            )
                        }
                    </p>


                    ${
                        career.description

                            ? `
                                <p
                                    class="career-description"
                                >
                                    ${
                                        escapeHTML(
                                            career.description
                                        )
                                    }
                                </p>
                            `

                            : ""
                    }


                    ${
                        isAdmin

                            ? `
                                <div
                                    class="card-admin-buttons"
                                >

                                    <button
                                        type="button"
                                        class="card-edit-button"
                                        data-action="edit-career"
                                        data-id="${career.id}"
                                    >
                                        수정
                                    </button>


                                    <button
                                        type="button"
                                        class="card-delete-button"
                                        data-action="delete-career"
                                        data-id="${career.id}"
                                    >
                                        삭제
                                    </button>

                                </div>
                            `

                            : ""
                    }

                </div>

            `;


            careerList
                .appendChild(
                    wrapper
                );
        }
    );
}


// ==================================================
// 새 경력
// ==================================================

function openNewCareer() {

    if (!isAdmin) {

        showToast(
            "관리자 로그인이 필요해요."
        );

        return;
    }


    careerForm.reset();

    careerId.value =
        "";

    careerModalTitle
        .textContent =
        "경력 추가";

    openModal(
        careerModal
    );
}


// ==================================================
// 경력 수정
// ==================================================

function editCareer(id) {

    if (!isAdmin) {
        return;
    }


    const career =
        careers.find(
            item =>
                item.id === id
        );


    if (!career) {
        return;
    }


    careerId.value =
        career.id;

    careerCompany.value =
        career.company ||
        "";

    careerPosition.value =
        career.position ||
        "";

    careerStartDate.value =
        career.start_date ||
        "";

    careerEndDate.value =
        career.end_date ||
        "";

    careerDescription.value =
        career.description ||
        "";

    careerOrder.value =
        career.sort_order ??
        "";

    careerModalTitle
        .textContent =
        "경력 수정";

    openModal(
        careerModal
    );
}


// ==================================================
// 경력 저장
// ==================================================

careerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!isAdmin) {

            showToast(
                "관리자만 저장할 수 있어요."
            );

            return;
        }


        const id =
            careerId.value;


        const data = {

            company:
                careerCompany
                    .value
                    .trim(),

            position:
                careerPosition
                    .value
                    .trim(),

            start_date:
                careerStartDate
                    .value ||
                null,

            end_date:
                careerEndDate
                    .value ||
                null,

            description:
                careerDescription
                    .value
                    .trim() ||
                null,

            sort_order:
                careerOrder
                    .value === ""

                    ? null

                    : Number(
                        careerOrder
                            .value
                    )
        };


        let error;


        if (id) {

            const result =
                await supabaseClient

                    .from("careers")

                    .update(data)

                    .eq(
                        "id",
                        Number(id)
                    );


            error =
                result.error;

        } else {

            const result =
                await supabaseClient

                    .from("careers")

                    .insert(data);


            error =
                result.error;
        }


        if (error) {

            console.error(
                "경력 저장 실패:",
                error
            );


            showToast(
                "경력을 저장하지 못했어요."
            );

            return;
        }


        closeModal(
            careerModal
        );


        showToast(
            id
                ? "경력을 수정했어요 ✨"
                : "경력을 추가했어요 💼"
        );


        await loadCareers();
    }
);


// ==================================================
// 경력 삭제
// ==================================================

async function deleteCareer(id) {

    if (!isAdmin) {
        return;
    }


    const career =
        careers.find(
            item =>
                item.id === id
        );


    if (!career) {
        return;
    }


    const answer =
        confirm(
            `"${career.company}" 경력을 삭제할까요?`
        );


    if (!answer) {
        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from("careers")

            .delete()

            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "경력 삭제 실패:",
            error
        );


        showToast(
            "경력을 삭제하지 못했어요."
        );

        return;
    }


    showToast(
        "경력을 삭제했어요."
    );


    await loadCareers();
}


// ==================================================
// 경력 카드 버튼
// ==================================================

careerList
    .addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;


            if (
                action ===
                "edit-career"
            ) {

                editCareer(
                    id
                );
            }


            if (
                action ===
                "delete-career"
            ) {

                deleteCareer(
                    id
                );
            }
        }
    );


// ==================================================
// 🔐 로그인 모달
// ==================================================

function openLoginModal() {

    openModal(
        loginModal
    );


    setTimeout(
        () => {

            loginEmail.focus();

        },

        100
    );
}


function closeLoginModal() {

    closeModal(
        loginModal
    );

    loginForm.reset();
}


// ==================================================
// 로그인
// ==================================================

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            loginEmail
                .value
                .trim();

        const password =
            loginPassword
                .value;


        const {
            data,
            error
        } =
            await supabaseClient

                .auth

                .signInWithPassword(
                    {
                        email,
                        password
                    }
                );


        if (error) {

            console.error(
                "로그인 실패:",
                error
            );


            showToast(
                "이메일 또는 비밀번호를 확인해주세요."
            );

            return;
        }


        const user =
            data.user;


        if (
            !user ||
            !ADMIN_UIDS.includes(
                user.id
            )
        ) {

            await supabaseClient
                .auth
                .signOut();


            showToast(
                "관리자 계정이 아니에요."
            );

            return;
        }


        isAdmin =
            true;


        closeLoginModal();

        updateAdminScreen();


        showToast(
            "관리자로 로그인했어요 🔓"
        );
    }
);


// ==================================================
// 로그아웃
// ==================================================

async function logoutAdmin() {

    const {
        error
    } =
        await supabaseClient

            .auth

            .signOut();


    if (error) {

        console.error(
            "로그아웃 실패:",
            error
        );


        showToast(
            "로그아웃하지 못했어요."
        );

        return;
    }


    isAdmin =
        false;


    updateAdminScreen();


    showToast(
        "로그아웃했어요."
    );
}


// ==================================================
// 기존 로그인 상태 확인
// ==================================================

async function checkAdminLogin() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient

            .auth

            .getSession();


    const user =
        session?.user;


    isAdmin =
        Boolean(
            user &&
            ADMIN_UIDS.includes(
                user.id
            )
        );


    updateAdminScreen();
}


// ==================================================
// 관리자 화면
// ==================================================

function updateAdminScreen() {

    if (isAdmin) {

        loginButton
            .classList
            .add("hidden");


        logoutButton
            .classList
            .remove("hidden");


        editProfileButton
            .classList
            .remove("hidden");


        addCertificationButton
            .classList
            .remove("hidden");


        addCareerButton
            .classList
            .remove("hidden");

    } else {

        loginButton
            .classList
            .remove("hidden");


        logoutButton
            .classList
            .add("hidden");


        editProfileButton
            .classList
            .add("hidden");


        addCertificationButton
            .classList
            .add("hidden");


        addCareerButton
            .classList
            .add("hidden");
    }


    renderCertifications();

    renderCareers();
}


// ==================================================
// 로그인 상태 실시간 감지
// ==================================================

supabaseClient.auth
    .onAuthStateChange(
        (
            _event,
            session
        ) => {

            const user =
                session?.user;


            isAdmin =
                Boolean(
                    user &&
                    ADMIN_UIDS.includes(
                        user.id
                    )
                );


            updateAdminScreen();
        }
    );


// ==================================================
// 버튼 연결
// ==================================================


// 로그인

loginButton.addEventListener(
    "click",
    openLoginModal
);


logoutButton.addEventListener(
    "click",
    logoutAdmin
);


closeLoginButton.addEventListener(
    "click",
    closeLoginModal
);


// 프로필

editProfileButton
    .addEventListener(
        "click",
        openProfileModal
    );


closeProfileModalButton
    .addEventListener(
        "click",
        () => {

            closeModal(
                profileModal
            );
        }
    );


cancelProfileButton
    .addEventListener(
        "click",
        () => {

            closeModal(
                profileModal
            );
        }
    );


// 자격증

addCertificationButton
    .addEventListener(
        "click",
        openNewCertification
    );


closeCertificationModalButton
    .addEventListener(
        "click",
        () => {

            closeModal(
                certificationModal
            );
        }
    );


cancelCertificationButton
    .addEventListener(
        "click",
        () => {

            closeModal(
                certificationModal
            );
        }
    );


// 경력

addCareerButton
    .addEventListener(
        "click",
        openNewCareer
    );


closeCareerModalButton
    .addEventListener(
        "click",
        () => {

            closeModal(
                careerModal
            );
        }
    );


cancelCareerButton
    .addEventListener(
        "click",
        () => {

            closeModal(
                careerModal
            );
        }
    );


// ==================================================
// 모달 바깥 클릭
// ==================================================

[
    [
        loginModal,
        closeLoginModal
    ],

    [
        profileModal,
        () =>
            closeModal(
                profileModal
            )
    ],

    [
        profileCropModal,
        closeProfileCropper
    ],

    [
        certificationModal,
        () =>
            closeModal(
                certificationModal
            )
    ],

    [
        careerModal,
        () =>
            closeModal(
                careerModal
            )
    ]

].forEach(
    ([
        modal,
        closeFunction
    ]) => {

        modal
            ?.querySelector(
                ".modal-overlay"
            )

            ?.addEventListener(
                "click",
                closeFunction
            );
    }
);


// ==================================================
// ESC 닫기
// ==================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;
        }


        /*
            사진 편집창부터 닫기
        */

        if (
            !profileCropModal
                .classList
                .contains("hidden")
        ) {

            closeProfileCropper();

            return;
        }


        if (
            !careerModal
                .classList
                .contains("hidden")
        ) {

            closeModal(
                careerModal
            );

            return;
        }


        if (
            !certificationModal
                .classList
                .contains("hidden")
        ) {

            closeModal(
                certificationModal
            );

            return;
        }


        if (
            !profileModal
                .classList
                .contains("hidden")
        ) {

            closeModal(
                profileModal
            );

            return;
        }


        if (
            !loginModal
                .classList
                .contains("hidden")
        ) {

            closeLoginModal();
        }
    }
);


// ==================================================
// 토스트
// ==================================================

function showToast(message) {

    toast.textContent =
        message;


    toast
        .classList
        .add("show");


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast
                    .classList
                    .remove("show");

            },

            2200
        );
}


// ==================================================
// 🚀 시작
// ==================================================

async function startApp() {

    await checkAdminLogin();


    await Promise.all(
        [
            loadProfile(),
            loadCertifications(),
            loadCareers()
        ]
    );
}


startApp();