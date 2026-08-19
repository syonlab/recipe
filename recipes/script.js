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

let isAdmin = false;


// ==================================================
// HTML 요소
// ==================================================

const recipeList =
    document.getElementById("recipeList");

const recipeCount =
    document.getElementById("recipeCount");

const emptyState =
    document.getElementById("emptyState");

const addRecipeButton =
    document.getElementById("addRecipeButton");

const recipeModal =
    document.getElementById("recipeModal");

const closeModalButton =
    document.getElementById("closeModalButton");

const cancelButton =
    document.getElementById("cancelButton");

const recipeForm =
    document.getElementById("recipeForm");

const recipeId =
    document.getElementById("recipeId");

const recipeName =
    document.getElementById("recipeName");

const recipeCategory =
    document.getElementById("recipeCategory");

const recipeTime =
    document.getElementById("recipeTime");

const recipeDescription =
    document.getElementById(
        "recipeDescription"
    );

const recipeIngredients =
    document.getElementById(
        "recipeIngredients"
    );

const recipeSteps =
    document.getElementById("recipeSteps");

const recipeTip =
    document.getElementById("recipeTip");

const recipeImage =
    document.getElementById("recipeImage");

const imagePreviewWrapper =
    document.getElementById(
        "imagePreviewWrapper"
    );

const imagePreview =
    document.getElementById("imagePreview");

const editImageButton =
    document.getElementById(
        "editImageButton"
    );

const removeImageButton =
    document.getElementById(
        "removeImageButton"
    );

const modalTitle =
    document.getElementById("modalTitle");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const categorySection =
    document.getElementById(
        "categorySection"
    );

const sortSelect =
    document.getElementById("sortSelect");

const favoriteButton =
    document.getElementById(
        "favoriteButton"
    );

const detailModal =
    document.getElementById("detailModal");

const detailBody =
    document.getElementById("detailBody");

const closeDetailButton =
    document.getElementById(
        "closeDetailButton"
    );

const toast =
    document.getElementById("toast");


// ==================================================
// 카테고리 관련 요소
// ==================================================

const addCategoryButton =
    document.getElementById(
        "addCategoryButton"
    );

const categoryModal =
    document.getElementById(
        "categoryModal"
    );

const closeCategoryModalButton =
    document.getElementById(
        "closeCategoryModalButton"
    );

const cancelCategoryButton =
    document.getElementById(
        "cancelCategoryButton"
    );

const categoryForm =
    document.getElementById(
        "categoryForm"
    );

const newCategoryName =
    document.getElementById(
        "newCategoryName"
    );


// ==================================================
// 로그인 관련 요소
// ==================================================

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const loginModal =
    document.getElementById("loginModal");

const closeLoginButton =
    document.getElementById(
        "closeLoginButton"
    );

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById(
        "loginPassword"
    );


// ==================================================
// 📸 사진 크롭 관련 요소
// ==================================================

const cropModal =
    document.getElementById("cropModal");

const cropImage =
    document.getElementById("cropImage");

const closeCropModalButton =
    document.getElementById(
        "closeCropModalButton"
    );

const cancelCropButton =
    document.getElementById(
        "cancelCropButton"
    );

const applyCropButton =
    document.getElementById(
        "applyCropButton"
    );

const zoomSlider =
    document.getElementById("zoomSlider");

const rotateLeftButton =
    document.getElementById(
        "rotateLeftButton"
    );

const rotateRightButton =
    document.getElementById(
        "rotateRightButton"
    );

const resetCropButton =
    document.getElementById(
        "resetCropButton"
    );


// ==================================================
// 현재 상태
// ==================================================

let recipes = [];

let categories = [];

let selectedCategory = "전체";

let favoriteOnly = false;


// ==================================================
// 사진 상태
// ==================================================

// 최종적으로 Supabase에 업로드할 사진

let selectedImageFile = null;


// 수정 중인 기존 사진 URL

let currentImage = "";


// 수정 중인 기존 Storage 경로

let currentImagePath = "";


// 기존 사진을 삭제하기로 했는지

let removeExistingImage = false;


// Cropper 객체

let cropper = null;


// 사용자가 고른 원본

let originalImageFile = null;


// Cropper에 사용하는 임시 URL

let cropObjectURL = "";


// 잘린 사진 미리보기 임시 URL

let croppedPreviewURL = "";


// 확대 슬라이더 이전 값

let lastZoomSliderValue = 0;


// ==================================================
// HTML 안전 처리
// ==================================================

function escapeHTML(value = "") {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ==================================================
// 카테고리 아이콘
// ==================================================

function getCategoryIcon(name) {

    const icons = {

        "한식": "🍚",

        "양식": "🍝",

        "중식": "🥟",

        "일식": "🍣",

        "복어": "🐡",

        "떡": "🍡",

        "브런치실무": "🥐",

        "한식디저트실무": "🍵",

        "집밥": "🏠"

    };


    return icons[name] || "🥄";
}


// ==================================================
// 📂 카테고리 불러오기
// ==================================================

async function loadCategories() {

    const { data, error } =
        await supabaseClient

            .from("categories")

            .select("*")

            .order(
                "id",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "카테고리 불러오기 실패:",
            error
        );


        showToast(
            "카테고리를 불러오지 못했어요."
        );


        return;
    }


    categories =
        data || [];


    renderCategories();
}


// ==================================================
// 카테고리 표시
// ==================================================

function renderCategories() {

    categorySection

        .querySelectorAll(
            ".dynamic-category"
        )

        .forEach(
            button =>
                button.remove()
        );


    const allButton =
        categorySection.querySelector(
            '[data-category="전체"]'
        );


    categories.forEach(
        category => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "category dynamic-category";


            button.dataset.category =
                category.name;


            button.textContent =
                `${
                    getCategoryIcon(
                        category.name
                    )
                } ${category.name}`;


            if (
                selectedCategory ===
                category.name
            ) {

                button.classList.add(
                    "active"
                );
            }


            categorySection.insertBefore(
                button,
                addCategoryButton
            );
        }
    );


    if (
        selectedCategory === "전체"
    ) {

        allButton?.classList.add(
            "active"
        );

    } else {

        allButton?.classList.remove(
            "active"
        );
    }


    // 레시피 등록창 select 생성

    const oldValue =
        recipeCategory.value;


    recipeCategory.innerHTML =
        `
            <option value="">
                선택해주세요
            </option>
        `;


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.name;


            option.textContent =
                category.name;


            recipeCategory.appendChild(
                option
            );
        }
    );


    if (
        categories.some(
            category =>
                category.name ===
                oldValue
        )
    ) {

        recipeCategory.value =
            oldValue;
    }
}


// ==================================================
// 카테고리 추가창
// ==================================================

function openCategoryModal() {

    if (!isAdmin) {

        showToast(
            "관리자 로그인이 필요해요."
        );

        return;
    }


    categoryModal
        .classList
        .remove("hidden");


    document.body.style.overflow =
        "hidden";


    setTimeout(
        () => {

            newCategoryName.focus();

        },

        100
    );
}


function closeCategoryModal() {

    categoryModal
        .classList
        .add("hidden");


    categoryForm.reset();


    restoreBodyScroll();
}


// ==================================================
// 카테고리 저장
// ==================================================

categoryForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!isAdmin) {

            showToast(
                "관리자만 추가할 수 있어요."
            );

            return;
        }


        const name =
            newCategoryName
                .value
                .trim();


        if (!name) {

            showToast(
                "카테고리 이름을 입력해주세요."
            );

            return;
        }


        const alreadyExists =
            categories.some(
                category =>
                    category.name
                        .toLowerCase() ===
                    name.toLowerCase()
            );


        if (alreadyExists) {

            showToast(
                "이미 있는 카테고리예요."
            );

            return;
        }


        const { error } =
            await supabaseClient

                .from("categories")

                .insert({
                    name
                });


        if (error) {

            console.error(
                "카테고리 추가 실패:",
                error
            );


            if (
                error.code === "23505"
            ) {

                showToast(
                    "이미 있는 카테고리예요."
                );

            } else {

                showToast(
                    "카테고리를 추가하지 못했어요."
                );
            }


            return;
        }


        closeCategoryModal();


        showToast(
            `"${name}" 카테고리를 추가했어요 ✨`
        );


        await loadCategories();
    }
);


// ==================================================
// ☁️ 레시피 불러오기
// ==================================================

async function loadRecipes() {

    const { data, error } =
        await supabaseClient

            .from("recipes")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "레시피 불러오기 실패:",
            error
        );


        showToast(
            "레시피를 불러오지 못했어요."
        );


        return;
    }


    recipes =
        (data || []).map(
            recipe => ({

                id:
                    recipe.id,

                name:
                    recipe.name || "",

                category:
                    recipe.category || "",

                time:
                    recipe.cooking_time || "",

                description:
                    recipe.description || "",

                ingredients:
                    Array.isArray(
                        recipe.ingredients
                    )
                        ? recipe.ingredients
                        : [],

                steps:
                    Array.isArray(
                        recipe.steps
                    )
                        ? recipe.steps
                        : [],

                tip:
                    recipe.tip || "",

                image:
                    recipe.image_url || "",

                imagePath:
                    recipe.image_path || "",

                favorite:
                    Boolean(
                        recipe.favorite
                    ),

                createdAt:
                    recipe.created_at

                        ? new Date(
                            recipe.created_at
                        ).getTime()

                        : 0

            })
        );


    renderRecipes();
}


// ==================================================
// 📸 새 사진 선택
// ==================================================

recipeImage.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showToast(
                "이미지 파일만 선택해주세요."
            );


            recipeImage.value =
                "";


            return;
        }


        originalImageFile =
            file;


        openCropModal(
            originalImageFile
        );
    }
);


// ==================================================
// ✂️ Cropper 열기
// ==================================================

function openCropModal(file) {

    if (!file) {
        return;
    }


    destroyCropper();


    revokeCropObjectURL();


    cropObjectURL =
        URL.createObjectURL(
            file
        );


    cropImage.src =
        cropObjectURL;


    cropModal
        .classList
        .remove("hidden");


    document.body.style.overflow =
        "hidden";


    zoomSlider.value =
        0;


    lastZoomSliderValue =
        0;


    cropImage.onload =
        () => {

            destroyCropper();


            cropper =
                new Cropper(
                    cropImage,
                    {

                        // ⭐ 고정 4:3

                        aspectRatio:
                            4 / 3,


                        viewMode:
                            1,


                        dragMode:
                            "move",


                        autoCropArea:
                            0.95,


                        responsive:
                            true,


                        restore:
                            false,


                        guides:
                            true,


                        center:
                            true,


                        highlight:
                            false,


                        background:
                            false,


                        movable:
                            true,


                        rotatable:
                            true,


                        scalable:
                            false,


                        zoomable:
                            true,


                        zoomOnTouch:
                            true,


                        zoomOnWheel:
                            true,


                        cropBoxMovable:
                            false,


                        cropBoxResizable:
                            false,


                        toggleDragModeOnDblclick:
                            false

                    }
                );
        };
}


// ==================================================
// Cropper 제거
// ==================================================

function destroyCropper() {

    if (!cropper) {
        return;
    }


    cropper.destroy();


    cropper =
        null;
}


// ==================================================
// Cropper URL 제거
// ==================================================

function revokeCropObjectURL() {

    if (!cropObjectURL) {
        return;
    }


    URL.revokeObjectURL(
        cropObjectURL
    );


    cropObjectURL =
        "";
}


// ==================================================
// 잘린 미리보기 URL 제거
// ==================================================

function revokeCroppedPreviewURL() {

    if (!croppedPreviewURL) {
        return;
    }


    URL.revokeObjectURL(
        croppedPreviewURL
    );


    croppedPreviewURL =
        "";
}


// ==================================================
// 사진 편집창 닫기
// ==================================================

function closeCropModal() {

    destroyCropper();


    cropImage.onload =
        null;


    cropImage.src =
        "";


    revokeCropObjectURL();


    cropModal
        .classList
        .add("hidden");


    zoomSlider.value =
        0;


    lastZoomSliderValue =
        0;


    restoreBodyScroll();
}


// ==================================================
// 사진 편집 취소
// ==================================================

function cancelCropEditing() {

    recipeImage.value =
        "";


    closeCropModal();


    // 기존 사진이 있으면 다시 보여주기

    if (currentImage) {

        imagePreview.src =
            currentImage;


        imagePreviewWrapper
            .classList
            .remove("hidden");


        return;
    }


    // 이미 잘라둔 새 사진이 있다면 유지

    if (
        selectedImageFile &&
        croppedPreviewURL
    ) {

        imagePreview.src =
            croppedPreviewURL;


        imagePreviewWrapper
            .classList
            .remove("hidden");


        return;
    }


    imagePreview.src =
        "";


    imagePreviewWrapper
        .classList
        .add("hidden");
}


// ==================================================
// 확대 / 축소
// ==================================================

zoomSlider.addEventListener(
    "input",
    event => {

        if (!cropper) {
            return;
        }


        const value =
            Number(
                event.target.value
            );


        const difference =
            value -
            lastZoomSliderValue;


        /*
            이전 값과 차이만큼
            조금씩 확대/축소
        */

        cropper.zoom(
            difference * 0.01
        );


        lastZoomSliderValue =
            value;
    }
);


// ==================================================
// 사진 회전
// ==================================================

rotateLeftButton.addEventListener(
    "click",
    () => {

        if (!cropper) {
            return;
        }


        cropper.rotate(
            -90
        );
    }
);


rotateRightButton.addEventListener(
    "click",
    () => {

        if (!cropper) {
            return;
        }


        cropper.rotate(
            90
        );
    }
);


// ==================================================
// 편집 초기화
// ==================================================

resetCropButton.addEventListener(
    "click",
    () => {

        if (!cropper) {
            return;
        }


        cropper.reset();


        zoomSlider.value =
            0;


        lastZoomSliderValue =
            0;
    }
);


// ==================================================
// ✂️ 자르기 완료
// ==================================================

applyCropButton.addEventListener(
    "click",
    () => {

        if (!cropper) {

            showToast(
                "사진을 불러오는 중이에요."
            );

            return;
        }


        const canvas =
            cropper.getCroppedCanvas({
                width:
                    1200,

                height:
                    900,

                imageSmoothingEnabled:
                    true,

                imageSmoothingQuality:
                    "high"
            });


        if (!canvas) {

            showToast(
                "사진 편집에 실패했어요."
            );

            return;
        }


        canvas.toBlob(

            blob => {

                if (!blob) {

                    showToast(
                        "사진 편집에 실패했어요."
                    );

                    return;
                }


                selectedImageFile =
                    new File(
                        [blob],

                        `recipe-${
                            Date.now()
                        }.webp`,

                        {
                            type:
                                "image/webp"
                        }
                    );


                removeExistingImage =
                    false;


                revokeCroppedPreviewURL();


                croppedPreviewURL =
                    URL.createObjectURL(
                        blob
                    );


                imagePreview.src =
                    croppedPreviewURL;


                imagePreviewWrapper
                    .classList
                    .remove("hidden");


                recipeImage.value =
                    "";


                closeCropModal();


                showToast(
                    "사진 편집 완료 ✨"
                );

            },

            "image/webp",

            0.88
        );
    }
);


// ==================================================
// ✂️ 다시 편집
// ==================================================

editImageButton.addEventListener(
    "click",
    async () => {

        // 방금 선택한 원본이 있으면
        // 원본으로 다시 편집

        if (originalImageFile) {

            openCropModal(
                originalImageFile
            );

            return;
        }


        // 기존 Supabase 사진 수정

        if (currentImage) {

            try {

                showToast(
                    "사진을 불러오고 있어요 📸"
                );


                const response =
                    await fetch(
                        currentImage
                    );


                if (!response.ok) {

                    throw new Error(
                        "사진 다운로드 실패"
                    );
                }


                const blob =
                    await response.blob();


                originalImageFile =
                    new File(
                        [blob],

                        `recipe-edit-${
                            Date.now()
                        }`,

                        {
                            type:
                                blob.type ||
                                "image/webp"
                        }
                    );


                openCropModal(
                    originalImageFile
                );

            }

            catch (error) {

                console.error(
                    "기존 사진 편집 실패:",
                    error
                );


                showToast(
                    "사진을 다시 불러오지 못했어요."
                );
            }


            return;
        }


        showToast(
            "편집할 사진을 먼저 선택해주세요."
        );
    }
);


// ==================================================
// 🗑️ 사진 삭제
// ==================================================

removeImageButton.addEventListener(
    "click",
    () => {

        selectedImageFile =
            null;


        originalImageFile =
            null;


        recipeImage.value =
            "";


        revokeCroppedPreviewURL();


        if (
            currentImage ||
            currentImagePath
        ) {

            removeExistingImage =
                true;
        }


        currentImage =
            "";


        imagePreview.src =
            "";


        imagePreviewWrapper
            .classList
            .add("hidden");


        showToast(
            "사진을 삭제했어요. 저장하면 반영돼요."
        );
    }
);


// ==================================================
// 사진 편집창 버튼
// ==================================================

cancelCropButton.addEventListener(
    "click",
    cancelCropEditing
);


closeCropModalButton.addEventListener(
    "click",
    cancelCropEditing
);


cropModal
    .querySelector(
        ".modal-overlay"
    )
    ?.addEventListener(
        "click",
        cancelCropEditing
    );


// ==================================================
// 📦 사진 압축
// ==================================================

async function compressImage(file) {

    /*
        Cropper에서 나온 사진은
        이미 1200x900 WebP라 거의 그대로 사용.

        기존 이미지 업로드 호환을 위해
        일반 사진일 경우만 압축.
    */

    if (
        file.type === "image/webp"
    ) {

        return file;
    }


    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    const img =
                        new Image();


                    img.onload =
                        () => {

                            const MAX_SIZE =
                                1600;


                            let width =
                                img.width;


                            let height =
                                img.height;


                            if (
                                width > MAX_SIZE ||
                                height > MAX_SIZE
                            ) {

                                const ratio =
                                    Math.min(

                                        MAX_SIZE /
                                            width,

                                        MAX_SIZE /
                                            height
                                    );


                                width =
                                    Math.round(
                                        width *
                                        ratio
                                    );


                                height =
                                    Math.round(
                                        height *
                                        ratio
                                    );
                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );


                            canvas.toBlob(

                                blob => {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "사진 압축 실패"
                                            )
                                        );

                                        return;
                                    }


                                    resolve(
                                        blob
                                    );

                                },

                                "image/webp",

                                0.82
                            );
                        };


                    img.onerror =
                        reject;


                    img.src =
                        event.target.result;
                };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );
        }
    );
}


// ==================================================
// ☁️ 사진 업로드
// ==================================================

async function uploadRecipeImage(
    file
) {

    const compressed =
        await compressImage(
            file
        );


    const fileName =
        `${
            Date.now()
        }-${
            crypto.randomUUID()
        }.webp`;


    const filePath =
        `recipes/${fileName}`;


    const {
        error: uploadError
    } =
        await supabaseClient

            .storage

            .from(
                "recipe-images"
            )

            .upload(
                filePath,
                compressed,
                {
                    contentType:
                        "image/webp",

                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (uploadError) {

        console.error(
            "사진 업로드 실패:",
            uploadError
        );


        throw uploadError;
    }


    const {
        data: publicData
    } =
        supabaseClient

            .storage

            .from(
                "recipe-images"
            )

            .getPublicUrl(
                filePath
            );


    return {

        url:
            publicData.publicUrl,

        path:
            filePath
    };
}


// ==================================================
// Storage 사진 삭제
// ==================================================

async function deleteStorageImage(
    path
) {

    if (!path) {
        return;
    }


    const { error } =
        await supabaseClient

            .storage

            .from(
                "recipe-images"
            )

            .remove([
                path
            ]);


    if (error) {

        console.error(
            "Storage 사진 삭제 실패:",
            error
        );
    }
}


// ==================================================
// 레시피 화면 출력
// ==================================================

function renderRecipes() {

    let filteredRecipes =
        [...recipes];


    // 카테고리

    if (
        selectedCategory !==
        "전체"
    ) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>
                    recipe.category ===
                    selectedCategory
            );
    }


    // 검색

    const keyword =
        searchInput
            .value
            .trim()
            .toLowerCase();


    if (keyword) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe => {

                    const name =
                        recipe.name
                            .toLowerCase();


                    const description =
                        recipe.description
                            .toLowerCase();


                    const ingredients =
                        recipe.ingredients
                            .join(" ")
                            .toLowerCase();


                    return (

                        name.includes(
                            keyword
                        )

                        ||

                        description.includes(
                            keyword
                        )

                        ||

                        ingredients.includes(
                            keyword
                        )
                    );
                }
            );
    }


    // 즐겨찾기 필터

    if (favoriteOnly) {

        filteredRecipes =
            filteredRecipes.filter(
                recipe =>
                    recipe.favorite
            );
    }


    // 정렬

    if (
        sortSelect.value ===
        "latest"
    ) {

        filteredRecipes.sort(
            (a, b) =>
                b.createdAt -
                a.createdAt
        );
    }


    if (
        sortSelect.value ===
        "oldest"
    ) {

        filteredRecipes.sort(
            (a, b) =>
                a.createdAt -
                b.createdAt
        );
    }


    if (
        sortSelect.value ===
        "name"
    ) {

        filteredRecipes.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    "ko"
                )
        );
    }


    recipeList.innerHTML =
        "";


    recipeCount.textContent =
        `레시피 ${filteredRecipes.length}개`;


    if (
        filteredRecipes.length ===
        0
    ) {

        emptyState
            .classList
            .remove("hidden");


        return;
    }


    emptyState
        .classList
        .add("hidden");


    filteredRecipes.forEach(
        recipe => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "recipe-card";


            const imageHTML =
                recipe.image

                    ? `
                        <img
                            src="${
                                escapeHTML(
                                    recipe.image
                                )
                            }"
                            alt="${
                                escapeHTML(
                                    recipe.name
                                )
                            }"
                        >
                    `

                    : `
                        <div
                            style="
                                width:100%;
                                height:100%;
                                display:flex;
                                justify-content:center;
                                align-items:center;
                                font-size:60px;
                            "
                        >
                            🍳
                        </div>
                    `;


            card.innerHTML = `

                <div class="recipe-image-wrapper">

                    ${imageHTML}


                    <button
                        type="button"
                        class="
                            favorite-button
                            ${
                                recipe.favorite
                                    ? "active"
                                    : ""
                            }
                        "
                    >
                        ${
                            recipe.favorite
                                ? "♥"
                                : "♡"
                        }
                    </button>

                </div>


                <div class="recipe-info">

                    <div class="recipe-top-info">

                        <span class="recipe-category">

                            ${
                                getCategoryIcon(
                                    recipe.category
                                )
                            }

                            ${
                                escapeHTML(
                                    recipe.category
                                )
                            }

                        </span>


                        <span class="recipe-time">

                            ${
                                recipe.time
                                    ? "⏱ " +
                                      escapeHTML(
                                          recipe.time
                                      )
                                    : ""
                            }

                        </span>

                    </div>


                    <h3>
                        ${
                            escapeHTML(
                                recipe.name
                            )
                        }
                    </h3>


                    <p>
                        ${
                            escapeHTML(
                                recipe.description ||
                                "고장금의 맛있는 레시피"
                            )
                        }
                    </p>

                </div>
            `;


            card.addEventListener(
                "click",
                () => {

                    openDetail(
                        recipe.id
                    );
                }
            );


            const heart =
                card.querySelector(
                    ".favorite-button"
                );


            heart.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    toggleFavorite(
                        recipe.id
                    );
                }
            );


            recipeList.appendChild(
                card
            );
        }
    );
}


// ==================================================
// 레시피 등록창
// ==================================================

function openRecipeModal() {

    recipeModal
        .classList
        .remove("hidden");


    document.body.style.overflow =
        "hidden";
}


function closeRecipeModal() {

    recipeModal
        .classList
        .add("hidden");


    resetForm();


    restoreBodyScroll();
}


// ==================================================
// 새 레시피
// ==================================================

function openNewRecipe() {

    if (!isAdmin) {

        showToast(
            "관리자 로그인이 필요해요."
        );

        return;
    }


    resetForm();


    modalTitle.textContent =
        "새 레시피 등록";


    openRecipeModal();
}


// ==================================================
// 폼 초기화
// ==================================================

function resetForm() {

    recipeForm.reset();


    recipeId.value =
        "";


    selectedImageFile =
        null;


    originalImageFile =
        null;


    currentImage =
        "";


    currentImagePath =
        "";


    removeExistingImage =
        false;


    imagePreview.src =
        "";


    imagePreviewWrapper
        .classList
        .add("hidden");


    destroyCropper();


    revokeCropObjectURL();


    revokeCroppedPreviewURL();
}


// ==================================================
// 💾 레시피 저장
// ==================================================

recipeForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!isAdmin) {

            showToast(
                "관리자 로그인이 필요해요."
            );

            return;
        }


        const id =
            recipeId.value;


        const ingredients =
            recipeIngredients
                .value
                .split("\n")

                .map(
                    item =>
                        item.trim()
                )

                .filter(Boolean);


        const steps =
            recipeSteps
                .value
                .split("\n")

                .map(
                    item =>
                        item.trim()
                )

                .filter(Boolean);


        let imageUrl =
            currentImage;


        let imagePath =
            currentImagePath;


        let newlyUploadedPath =
            "";


        try {

            // 새 사진이 있으면 업로드

            if (selectedImageFile) {

                showToast(
                    "사진을 업로드하고 있어요 📸"
                );


                const uploaded =
                    await uploadRecipeImage(
                        selectedImageFile
                    );


                imageUrl =
                    uploaded.url;


                imagePath =
                    uploaded.path;


                newlyUploadedPath =
                    uploaded.path;
            }


            // 사진 삭제 선택

            if (
                removeExistingImage &&
                !selectedImageFile
            ) {

                imageUrl =
                    null;


                imagePath =
                    null;
            }


            const recipeData = {

                name:
                    recipeName
                        .value
                        .trim(),

                category:
                    recipeCategory.value,

                cooking_time:
                    recipeTime
                        .value
                        .trim() ||
                    null,

                description:
                    recipeDescription
                        .value
                        .trim() ||
                    null,

                ingredients:
                    ingredients,

                steps:
                    steps,

                tip:
                    recipeTip
                        .value
                        .trim() ||
                    null,

                image_url:
                    imageUrl ||
                    null,

                image_path:
                    imagePath ||
                    null
            };


            // =========================
            // 수정
            // =========================

            if (id) {

                const oldRecipe =
                    recipes.find(
                        recipe =>
                            recipe.id ===
                            Number(id)
                    );


                const { error } =
                    await supabaseClient

                        .from("recipes")

                        .update(
                            recipeData
                        )

                        .eq(
                            "id",
                            Number(id)
                        );


                if (error) {

                    throw error;
                }


                // 새 사진으로 변경했다면
                // 기존 Storage 사진 삭제

                if (
                    selectedImageFile &&
                    oldRecipe?.imagePath &&
                    oldRecipe.imagePath !==
                        imagePath
                ) {

                    await deleteStorageImage(
                        oldRecipe.imagePath
                    );
                }


                // 사진 삭제 선택

                if (
                    removeExistingImage &&
                    oldRecipe?.imagePath &&
                    !selectedImageFile
                ) {

                    await deleteStorageImage(
                        oldRecipe.imagePath
                    );
                }


                showToast(
                    "레시피를 수정했어요 ✨"
                );
            }


            // =========================
            // 새 레시피
            // =========================

            else {

                const { error } =
                    await supabaseClient

                        .from("recipes")

                        .insert(
                            recipeData
                        );


                if (error) {

                    throw error;
                }


                showToast(
                    "새 레시피를 저장했어요 🍳"
                );
            }


            closeRecipeModal();


            await loadRecipes();
        }


        catch (error) {

            console.error(
                "레시피 저장 실패:",
                error
            );


            // DB 저장 실패했는데
            // 새 사진만 올라갔다면 회수

            if (
                newlyUploadedPath
            ) {

                await deleteStorageImage(
                    newlyUploadedPath
                );
            }


            showToast(
                "저장 중 오류가 발생했어요."
            );
        }
    }
);


// ==================================================
// 상세보기
// ==================================================

function openDetail(id) {

    const recipe =
        recipes.find(
            recipe =>
                recipe.id === id
        );


    if (!recipe) {
        return;
    }


    const imageHTML =
        recipe.image

            ? `
                <img
                    class="detail-image"
                    src="${
                        escapeHTML(
                            recipe.image
                        )
                    }"
                    alt="${
                        escapeHTML(
                            recipe.name
                        )
                    }"
                >
            `

            : `
                <div
                    class="detail-placeholder"
                >
                    🍳
                </div>
            `;


    const ingredientsHTML =
        recipe.ingredients

            .map(
                ingredient => `

                    <li>
                        ${
                            escapeHTML(
                                ingredient
                            )
                        }
                    </li>
                `
            )

            .join("");


    const stepsHTML =
        recipe.steps

            .map(
                step => `

                    <li>
                        ${
                            escapeHTML(
                                step
                            )
                        }
                    </li>
                `
            )

            .join("");


    detailBody.innerHTML = `

        ${imageHTML}


        <div class="detail-inner">


            <div class="detail-badges">

                <span class="detail-badge">

                    ${
                        getCategoryIcon(
                            recipe.category
                        )
                    }

                    ${
                        escapeHTML(
                            recipe.category
                        )
                    }

                </span>


                ${
                    recipe.time

                        ? `
                            <span class="detail-badge">
                                ⏱ ${
                                    escapeHTML(
                                        recipe.time
                                    )
                                }
                            </span>
                        `

                        : ""
                }

            </div>


            <h2>
                ${
                    escapeHTML(
                        recipe.name
                    )
                }
            </h2>


            <p class="detail-description">
                ${
                    escapeHTML(
                        recipe.description
                    )
                }
            </p>


            <section class="detail-section">

                <h3>
                    🥕 재료
                </h3>

                <ul class="ingredient-list">
                    ${ingredientsHTML}
                </ul>

            </section>


            <section class="detail-section">

                <h3>
                    🍳 만드는 방법
                </h3>

                <ol class="step-list">
                    ${stepsHTML}
                </ol>

            </section>


            ${
                recipe.tip

                    ? `
                        <section
                            class="detail-section"
                        >

                            <h3>
                                💡 고장금의 요리 팁
                            </h3>

                            <div class="tip-box">
                                ${
                                    escapeHTML(
                                        recipe.tip
                                    )
                                }
                            </div>

                        </section>
                    `

                    : ""
            }


            ${
                isAdmin

                    ? `
                        <div class="detail-buttons">

                            <button
                                type="button"
                                class="edit-button"
                                id="detailEditButton"
                            >
                                수정하기
                            </button>


                            <button
                                type="button"
                                class="delete-button"
                                id="detailDeleteButton"
                            >
                                삭제하기
                            </button>

                        </div>
                    `

                    : ""
            }

        </div>
    `;


    detailModal
        .classList
        .remove("hidden");


    document.body.style.overflow =
        "hidden";


    if (isAdmin) {

        document
            .getElementById(
                "detailEditButton"
            )
            ?.addEventListener(
                "click",
                () =>
                    editRecipe(id)
            );


        document
            .getElementById(
                "detailDeleteButton"
            )
            ?.addEventListener(
                "click",
                () =>
                    deleteRecipe(id)
            );
    }
}


// ==================================================
// 상세보기 닫기
// ==================================================

function closeDetail() {

    detailModal
        .classList
        .add("hidden");


    restoreBodyScroll();
}


// ==================================================
// 레시피 수정
// ==================================================

function editRecipe(id) {

    if (!isAdmin) {

        showToast(
            "관리자만 수정할 수 있어요."
        );

        return;
    }


    const recipe =
        recipes.find(
            recipe =>
                recipe.id === id
        );


    if (!recipe) {
        return;
    }


    closeDetail();


    recipeId.value =
        recipe.id;


    recipeName.value =
        recipe.name;


    recipeCategory.value =
        recipe.category;


    recipeTime.value =
        recipe.time;


    recipeDescription.value =
        recipe.description;


    recipeIngredients.value =
        recipe.ingredients
            .join("\n");


    recipeSteps.value =
        recipe.steps
            .join("\n");


    recipeTip.value =
        recipe.tip;


    currentImage =
        recipe.image || "";


    currentImagePath =
        recipe.imagePath || "";


    selectedImageFile =
        null;


    originalImageFile =
        null;


    removeExistingImage =
        false;


    revokeCroppedPreviewURL();


    if (currentImage) {

        imagePreview.src =
            currentImage;


        imagePreviewWrapper
            .classList
            .remove("hidden");

    } else {

        imagePreview.src =
            "";


        imagePreviewWrapper
            .classList
            .add("hidden");
    }


    modalTitle.textContent =
        "레시피 수정";


    openRecipeModal();
}


// ==================================================
// 🗑️ 레시피 삭제
// ==================================================

async function deleteRecipe(id) {

    if (!isAdmin) {

        showToast(
            "관리자만 삭제할 수 있어요."
        );

        return;
    }


    const recipe =
        recipes.find(
            recipe =>
                recipe.id === id
        );


    if (!recipe) {
        return;
    }


    const answer =
        confirm(
            `"${recipe.name}" 레시피를 삭제할까요?`
        );


    if (!answer) {
        return;
    }


    const { error } =
        await supabaseClient

            .from("recipes")

            .delete()

            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "레시피 삭제 실패:",
            error
        );


        showToast(
            "삭제하지 못했어요."
        );


        return;
    }


    if (
        recipe.imagePath
    ) {

        await deleteStorageImage(
            recipe.imagePath
        );
    }


    closeDetail();


    showToast(
        "레시피를 삭제했어요."
    );


    await loadRecipes();
}


// ==================================================
// ♥ 즐겨찾기 변경
// ==================================================

async function toggleFavorite(id) {

    if (!isAdmin) {

        showToast(
            "즐겨찾기 변경은 관리자만 가능해요."
        );

        return;
    }


    const recipe =
        recipes.find(
            recipe =>
                recipe.id === id
        );


    if (!recipe) {
        return;
    }


    const newValue =
        !recipe.favorite;


    const { error } =
        await supabaseClient

            .from("recipes")

            .update({
                favorite:
                    newValue
            })

            .eq(
                "id",
                id
            );


    if (error) {

        console.error(
            "즐겨찾기 수정 실패:",
            error
        );


        showToast(
            "즐겨찾기를 변경하지 못했어요."
        );


        return;
    }


    recipe.favorite =
        newValue;


    renderRecipes();
}


// ==================================================
// 검색
// ==================================================

searchButton.addEventListener(
    "click",
    renderRecipes
);


searchInput.addEventListener(
    "input",
    renderRecipes
);


searchInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            renderRecipes();
        }
    }
);


// ==================================================
// 카테고리 선택
// ==================================================

categorySection.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".category"
            );


        if (!button) {
            return;
        }


        if (
            button.id ===
            "addCategoryButton"
        ) {

            return;
        }


        document
            .querySelectorAll(
                ".category"
            )
            .forEach(
                categoryButton => {

                    categoryButton
                        .classList
                        .remove(
                            "active"
                        );
                }
            );


        button
            .classList
            .add("active");


        selectedCategory =
            button.dataset.category;


        renderRecipes();
    }
);


// ==================================================
// 카테고리 버튼
// ==================================================

addCategoryButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        openCategoryModal();
    }
);


closeCategoryModalButton
    .addEventListener(
        "click",
        closeCategoryModal
    );


cancelCategoryButton
    .addEventListener(
        "click",
        closeCategoryModal
    );


categoryModal
    .querySelector(
        ".modal-overlay"
    )
    ?.addEventListener(
        "click",
        closeCategoryModal
    );


// ==================================================
// 정렬
// ==================================================

sortSelect.addEventListener(
    "change",
    renderRecipes
);


// ==================================================
// 즐겨찾기만 보기
// ==================================================

favoriteButton.addEventListener(
    "click",
    () => {

        favoriteOnly =
            !favoriteOnly;


        favoriteButton
            .classList
            .toggle(
                "active",
                favoriteOnly
            );


        favoriteButton.textContent =
            favoriteOnly
                ? "♥ 즐겨찾기"
                : "♡ 즐겨찾기";


        renderRecipes();
    }
);


// ==================================================
// 레시피 모달 버튼
// ==================================================

addRecipeButton.addEventListener(
    "click",
    openNewRecipe
);


closeModalButton.addEventListener(
    "click",
    closeRecipeModal
);


cancelButton.addEventListener(
    "click",
    closeRecipeModal
);


closeDetailButton.addEventListener(
    "click",
    closeDetail
);


recipeModal
    .querySelector(
        ".modal-overlay"
    )
    ?.addEventListener(
        "click",
        closeRecipeModal
    );


detailModal
    .querySelector(
        ".modal-overlay"
    )
    ?.addEventListener(
        "click",
        closeDetail
    );


// ==================================================
// 🔐 로그인창
// ==================================================

function openLoginModal() {

    loginModal
        .classList
        .remove("hidden");


    document.body.style.overflow =
        "hidden";
}


function closeLoginModal() {

    loginModal
        .classList
        .add("hidden");


    loginForm.reset();


    restoreBodyScroll();
}


// ==================================================
// 로그인
// ==================================================

async function loginAdmin(
    event
) {

    event.preventDefault();


    const email =
        loginEmail
            .value
            .trim();


    const password =
        loginPassword.value;


    const { data, error } =
        await supabaseClient

            .auth

            .signInWithPassword({
                email,
                password
            });


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


// ==================================================
// 로그아웃
// ==================================================

async function logoutAdmin() {

    const { error } =
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
// 로그인 상태 확인
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
// 관리자 화면 표시
// ==================================================

function updateAdminScreen() {

    if (isAdmin) {

        loginButton
            .classList
            .add("hidden");


        logoutButton
            .classList
            .remove("hidden");


        addRecipeButton
            .classList
            .remove("hidden");


        addCategoryButton
            .classList
            .remove("hidden");

    } else {

        loginButton
            .classList
            .remove("hidden");


        logoutButton
            .classList
            .add("hidden");


        addRecipeButton
            .classList
            .add("hidden");


        addCategoryButton
            .classList
            .add("hidden");
    }
}


// ==================================================
// 로그인 버튼 이벤트
// ==================================================

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


loginForm.addEventListener(
    "submit",
    loginAdmin
);


loginModal
    .querySelector(
        ".modal-overlay"
    )
    ?.addEventListener(
        "click",
        closeLoginModal
    );


// ==================================================
// 로그인 상태 변경 감지
// ==================================================

supabaseClient.auth
    .onAuthStateChange(
        (_event, session) => {

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
// 현재 열린 모달에 따라 스크롤 복구
// ==================================================

function restoreBodyScroll() {

    const anyModalOpen =
        [
            recipeModal,
            detailModal,
            loginModal,
            categoryModal,
            cropModal
        ]

        .some(
            modal =>
                modal &&
                !modal.classList.contains(
                    "hidden"
                )
        );


    document.body.style.overflow =
        anyModalOpen
            ? "hidden"
            : "";
}


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


        // Cropper가 가장 위에 있으므로
        // 먼저 닫기

        if (
            !cropModal
                .classList
                .contains("hidden")
        ) {

            cancelCropEditing();

            return;
        }


        if (
            !recipeModal
                .classList
                .contains("hidden")
        ) {

            closeRecipeModal();

            return;
        }


        if (
            !detailModal
                .classList
                .contains("hidden")
        ) {

            closeDetail();

            return;
        }


        if (
            !loginModal
                .classList
                .contains("hidden")
        ) {

            closeLoginModal();

            return;
        }


        if (
            !categoryModal
                .classList
                .contains("hidden")
        ) {

            closeCategoryModal();
        }
    }
);


// ==================================================
// 알림
// ==================================================

let toastTimer =
    null;


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
// 🚀 홈페이지 시작
// ==================================================

async function startApp() {

    await checkAdminLogin();


    await loadCategories();


    await loadRecipes();
}


startApp();