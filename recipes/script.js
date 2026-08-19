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
let currentUser = null;


// ==================================================
// ⭐ 개인 즐겨찾기
// 브라우저마다 따로 저장
// ==================================================

const FAVORITES_STORAGE_KEY =
    "gojanggeum_recipe_favorites_v1";

let favoriteIds =
    new Set();

let favoriteOnly =
    false;


// ==================================================
// ❤️ 공개 좋아요
// ==================================================

let likeCounts =
    new Map();

let likedRecipeIds =
    new Set();

let likeBusyIds =
    new Set();


// ==================================================
// 💬 댓글
// ==================================================

let commentsByRecipe =
    new Map();

let commentBusy =
    false;

let replyBusy =
    false;


// ==================================================
// 현재 데이터
// ==================================================

let recipes = [];
let categories = [];

let selectedCategory =
    "전체";


// ==================================================
// HTML 요소
// ==================================================

const recipeList =
    document.getElementById(
        "recipeList"
    );

const recipeCount =
    document.getElementById(
        "recipeCount"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const addRecipeButton =
    document.getElementById(
        "addRecipeButton"
    );

const recipeModal =
    document.getElementById(
        "recipeModal"
    );

const closeModalButton =
    document.getElementById(
        "closeModalButton"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );

const recipeForm =
    document.getElementById(
        "recipeForm"
    );

const recipeId =
    document.getElementById(
        "recipeId"
    );

const recipeName =
    document.getElementById(
        "recipeName"
    );

const recipeCategory =
    document.getElementById(
        "recipeCategory"
    );

const recipeTime =
    document.getElementById(
        "recipeTime"
    );

const recipeDescription =
    document.getElementById(
        "recipeDescription"
    );

const recipeIngredients =
    document.getElementById(
        "recipeIngredients"
    );

const recipeSteps =
    document.getElementById(
        "recipeSteps"
    );

const recipeTip =
    document.getElementById(
        "recipeTip"
    );

const recipeImage =
    document.getElementById(
        "recipeImage"
    );

const imagePreviewWrapper =
    document.getElementById(
        "imagePreviewWrapper"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );

const editImageButton =
    document.getElementById(
        "editImageButton"
    );

const removeImageButton =
    document.getElementById(
        "removeImageButton"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchButton =
    document.getElementById(
        "searchButton"
    );

const categorySection =
    document.getElementById(
        "categorySection"
    );

const sortSelect =
    document.getElementById(
        "sortSelect"
    );

const favoriteButton =
    document.getElementById(
        "favoriteButton"
    );

const detailModal =
    document.getElementById(
        "detailModal"
    );

const detailBody =
    document.getElementById(
        "detailBody"
    );

const closeDetailButton =
    document.getElementById(
        "closeDetailButton"
    );

const toast =
    document.getElementById(
        "toast"
    );


// ==================================================
// 카테고리 관련
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
// 로그인 관련
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
// 📸 사진 Cropper
// ==================================================

const cropModal =
    document.getElementById(
        "cropModal"
    );

const cropImage =
    document.getElementById(
        "cropImage"
    );

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
    document.getElementById(
        "zoomSlider"
    );

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
// 사진 편집 상태
// ==================================================

let selectedImageFile = null;
let originalImageFile = null;

let currentImage = "";
let currentImagePath = "";

let removeExistingImage = false;

let cropper = null;

let cropObjectURL = "";
let croppedPreviewURL = "";

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
        .replaceAll("'", "&#039;");
}


// ==================================================
// ⭐ 개인 즐겨찾기 불러오기
// ==================================================

function loadFavoriteIds() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    FAVORITES_STORAGE_KEY
                ) || "[]"
            );


        favoriteIds =
            new Set(
                Array.isArray(saved)
                    ? saved.map(Number)
                    : []
            );

    } catch (error) {

        console.error(
            "즐겨찾기 불러오기 실패:",
            error
        );


        favoriteIds =
            new Set();
    }
}


// ==================================================
// ⭐ 개인 즐겨찾기 저장
// ==================================================

function saveFavoriteIds() {

    try {

        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(
                [...favoriteIds]
            )
        );

    } catch (error) {

        console.error(
            "즐겨찾기 저장 실패:",
            error
        );
    }
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
// 👤 방문자 세션 준비
//
// 관리자 로그인 상태 → 그대로 사용
// 로그인 안 된 방문자 → 익명 로그인
// ==================================================

async function ensureUserSession() {

    const {
        data: {
            session
        },
        error
    } =
        await supabaseClient
            .auth
            .getSession();


    if (error) {

        console.error(
            "세션 확인 실패:",
            error
        );


        currentUser = null;
        isAdmin = false;


        updateAdminScreen();


        return false;
    }


    if (
        session?.user
    ) {

        currentUser =
            session.user;


        isAdmin =
            ADMIN_UIDS.includes(
                currentUser.id
            );


        updateAdminScreen();


        return true;
    }


    const {
        data,
        error: anonymousError
    } =
        await supabaseClient
            .auth
            .signInAnonymously();


    if (anonymousError) {

        console.error(
            "익명 로그인 실패:",
            anonymousError
        );


        currentUser = null;
        isAdmin = false;


        updateAdminScreen();


        return false;
    }


    currentUser =
        data.user ||
        data.session?.user ||
        null;


    isAdmin =
        Boolean(
            currentUser &&
            ADMIN_UIDS.includes(
                currentUser.id
            )
        );


    updateAdminScreen();


    return Boolean(
        currentUser
    );
}


// ==================================================
// 📂 카테고리 불러오기
// ==================================================

async function loadCategories() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "categories"
            )

            .select("*")

            .order(
                "id",
                {
                    ascending:
                        true
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
                `${getCategoryIcon(
                    category.name
                )} ${category.name}`;


            if (
                selectedCategory ===
                category.name
            ) {

                button
                    .classList
                    .add(
                        "active"
                    );
            }


            categorySection
                .insertBefore(
                    button,
                    addCategoryButton
                );
        }
    );


    if (
        selectedCategory ===
        "전체"
    ) {

        allButton
            ?.classList
            .add(
                "active"
            );

    } else {

        allButton
            ?.classList
            .remove(
                "active"
            );
    }


    const oldValue =
        recipeCategory.value;


    recipeCategory.innerHTML = `
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


            recipeCategory
                .appendChild(
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
        .remove(
            "hidden"
        );


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
        .add(
            "hidden"
        );


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


        const {
            error
        } =
            await supabaseClient

                .from(
                    "categories"
                )

                .insert({
                    name
                });


        if (error) {

            console.error(
                "카테고리 추가 실패:",
                error
            );


            if (
                error.code ===
                "23505"
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

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "recipes"
            )

            .select("*")

            .order(
                "created_at",
                {
                    ascending:
                        false
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
        (data || [])
            .map(
                recipe => ({

                    id:
                        Number(
                            recipe.id
                        ),

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
                        favoriteIds.has(
                            Number(
                                recipe.id
                            )
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
// ❤️ 전체 좋아요 불러오기
// ==================================================

async function loadLikes() {

    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "recipe_likes"
            )

            .select(
                "recipe_id, user_id"
            );


    if (error) {

        console.error(
            "좋아요 불러오기 실패:",
            error
        );


        showToast(
            "좋아요 정보를 불러오지 못했어요."
        );


        return;
    }


    likeCounts =
        new Map();


    likedRecipeIds =
        new Set();


    (data || [])
        .forEach(
            like => {

                const id =
                    Number(
                        like.recipe_id
                    );


                likeCounts.set(
                    id,
                    (
                        likeCounts.get(
                            id
                        ) || 0
                    ) + 1
                );


                if (
                    currentUser &&
                    like.user_id ===
                        currentUser.id
                ) {

                    likedRecipeIds
                        .add(
                            id
                        );
                }
            }
        );


    renderRecipes();
}


// ==================================================
// ❤️ 좋아요 추가 / 취소
// ==================================================

async function toggleLike(id) {

    id =
        Number(id);


    if (
        likeBusyIds.has(
            id
        )
    ) {

        return;
    }


    if (!currentUser) {

        const ready =
            await ensureUserSession();


        if (!ready) {

            showToast(
                "좋아요 기능을 준비하지 못했어요."
            );


            return;
        }
    }


    likeBusyIds.add(
        id
    );


    try {

        const alreadyLiked =
            likedRecipeIds.has(
                id
            );


        if (alreadyLiked) {

            const {
                error
            } =
                await supabaseClient

                    .from(
                        "recipe_likes"
                    )

                    .delete()

                    .eq(
                        "recipe_id",
                        id
                    )

                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {

                throw error;
            }


            likedRecipeIds
                .delete(
                    id
                );


            likeCounts.set(
                id,
                Math.max(
                    0,
                    (
                        likeCounts.get(
                            id
                        ) || 1
                    ) - 1
                )
            );

        } else {

            const {
                error
            } =
                await supabaseClient

                    .from(
                        "recipe_likes"
                    )

                    .insert({
                        recipe_id:
                            id,

                        user_id:
                            currentUser.id
                    });


            if (error) {

                if (
                    error.code ===
                    "23505"
                ) {

                    await loadLikes();


                    return;
                }


                throw error;
            }


            likedRecipeIds
                .add(
                    id
                );


            likeCounts.set(
                id,
                (
                    likeCounts.get(
                        id
                    ) || 0
                ) + 1
            );
        }


        renderRecipes();


        if (
            !detailModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            renderDetail(
                id
            );
        }


    } catch (error) {

        console.error(
            "좋아요 변경 실패:",
            error
        );


        showToast(
            "좋아요를 변경하지 못했어요."
        );


    } finally {

        likeBusyIds.delete(
            id
        );
    }
}


// ==================================================
// ⭐ 개인 즐겨찾기 변경
// ==================================================

function toggleFavorite(id) {

    id =
        Number(id);


    const recipe =
        recipes.find(
            recipe =>
                recipe.id ===
                id
        );


    if (!recipe) {

        return;
    }


    if (
        favoriteIds.has(
            id
        )
    ) {

        favoriteIds.delete(
            id
        );


        recipe.favorite =
            false;


        showToast(
            "즐겨찾기에서 뺐어요."
        );

    } else {

        favoriteIds.add(
            id
        );


        recipe.favorite =
            true;


        showToast(
            "즐겨찾기에 담았어요 ⭐"
        );
    }


    saveFavoriteIds();


    renderRecipes();
}


// ==================================================
// 💬 댓글 날짜 표시
// ==================================================

function formatCommentDate(value) {

    if (!value) {

        return "";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }


    return new Intl.DateTimeFormat(
        "ko-KR",
        {
            year:
                "numeric",

            month:
                "2-digit",

            day:
                "2-digit",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(
        date
    );
}


// ==================================================
// 💬 특정 레시피 댓글 불러오기
// ==================================================

async function loadComments(recipeId) {

    recipeId =
        Number(
            recipeId
        );


    const {
        data,
        error
    } =
        await supabaseClient

            .from(
                "recipe_comments"
            )

            .select(
                "id, created_at, recipe_id, user_id, nickname, content, parent_id"
            )

            .eq(
                "recipe_id",
                recipeId
            )

            .order(
                "created_at",
                {
                    ascending:
                        true
                }
            );


    if (error) {

        console.error(
            "댓글 불러오기 실패:",
            error
        );


        commentsByRecipe.set(
            recipeId,
            []
        );


        return [];
    }


    const comments =
        data || [];


    commentsByRecipe.set(
        recipeId,
        comments
    );


    return comments;
}


// ==================================================
// 💬 댓글 HTML 만들기
// ==================================================

function createCommentsHTML(recipeId) {

    recipeId =
        Number(
            recipeId
        );


    const comments =
        commentsByRecipe.get(
            recipeId
        ) || [];


    const parentComments =
        comments.filter(
            comment =>
                comment.parent_id ===
                null
        );


    const replies =
        comments.filter(
            comment =>
                comment.parent_id !==
                null
        );


    const commentsHTML =
        parentComments

            .map(
                comment => {

                    const childReplies =
                        replies.filter(
                            reply =>
                                Number(
                                    reply.parent_id
                                ) ===
                                Number(
                                    comment.id
                                )
                        );


                    const canDelete =
                        Boolean(
                            currentUser &&
                            (
                                comment.user_id ===
                                currentUser.id
                                ||
                                isAdmin
                            )
                        );


                    const replyHTML =
                        childReplies

                            .map(
                                reply => {

                                    const canDeleteReply =
                                        Boolean(
                                            currentUser &&
                                            (
                                                reply.user_id ===
                                                currentUser.id
                                                ||
                                                isAdmin
                                            )
                                        );


                                    return `
                                        <div class="comment-reply">

                                            <div class="comment-reply-header">

                                                <div class="comment-author-area">

                                                    <span class="comment-admin-badge">
                                                        👑 고장금
                                                    </span>


                                                    <span class="comment-date">
                                                        ${escapeHTML(
                                                            formatCommentDate(
                                                                reply.created_at
                                                            )
                                                        )}
                                                    </span>

                                                </div>


                                                ${
                                                    canDeleteReply

                                                        ? `
                                                            <button
                                                                type="button"
                                                                class="comment-delete-button"
                                                                data-comment-delete="${reply.id}"
                                                            >
                                                                삭제
                                                            </button>
                                                        `

                                                        : ""
                                                }

                                            </div>


                                            <p class="comment-text">
                                                ${escapeHTML(
                                                    reply.content
                                                )}
                                            </p>

                                        </div>
                                    `;
                                }
                            )

                            .join(
                                ""
                            );


                    return `
                        <article
                            class="comment-item"
                            data-comment-id="${comment.id}"
                        >

                            <div class="comment-item-header">

                                <div class="comment-author-area">

                                    <strong class="comment-author">
                                        ${escapeHTML(
                                            comment.nickname
                                        )}
                                    </strong>


                                    <span class="comment-date">
                                        ${escapeHTML(
                                            formatCommentDate(
                                                comment.created_at
                                            )
                                        )}
                                    </span>

                                </div>


                                ${
                                    canDelete

                                        ? `
                                            <button
                                                type="button"
                                                class="comment-delete-button"
                                                data-comment-delete="${comment.id}"
                                            >
                                                삭제
                                            </button>
                                        `

                                        : ""
                                }

                            </div>


                            <p class="comment-text">
                                ${escapeHTML(
                                    comment.content
                                )}
                            </p>


                            ${
                                isAdmin

                                    ? `
                                        <button
                                            type="button"
                                            class="comment-reply-button"
                                            data-reply-open="${comment.id}"
                                        >
                                            ↳ 답글 달기
                                        </button>


                                        <form
                                            class="comment-reply-form hidden"
                                            data-reply-form="${comment.id}"
                                        >

                                            <textarea
                                                class="comment-reply-input"
                                                maxlength="500"
                                                placeholder="고장금님의 답글을 입력해주세요."
                                                required
                                            ></textarea>


                                            <div class="comment-reply-form-buttons">

                                                <button
                                                    type="button"
                                                    class="comment-reply-cancel"
                                                    data-reply-cancel="${comment.id}"
                                                >
                                                    취소
                                                </button>


                                                <button
                                                    type="submit"
                                                    class="comment-reply-submit"
                                                >
                                                    답글 등록
                                                </button>

                                            </div>

                                        </form>
                                    `

                                    : ""
                            }


                            ${
                                replyHTML

                                    ? `
                                        <div class="comment-replies">
                                            ${replyHTML}
                                        </div>
                                    `

                                    : ""
                            }

                        </article>
                    `;
                }
            )

            .join(
                ""
            );


    return `
        <section
            class="comment-section"
            id="commentSection"
        >

            <div class="comment-section-header">

                <div>

                    <p class="comment-eyebrow">
                        COMMENT
                    </p>


                    <h3>
                        💬 댓글

                        <span class="comment-count">
                            ${parentComments.length}
                        </span>
                    </h3>

                </div>

            </div>


            <form
                class="comment-form"
                id="commentForm"
            >

                <div class="comment-form-group">

                    <label for="commentNickname">
                        닉네임
                    </label>


                    <input
                        type="text"
                        id="commentNickname"
                        maxlength="20"
                        placeholder="닉네임을 입력해주세요"
                        ${
                            isAdmin
                                ? 'value="고장금" readonly'
                                : ""
                        }
                        required
                    >

                </div>


                <div class="comment-form-group">

                    <label for="commentContent">
                        댓글
                    </label>


                    <textarea
                        id="commentContent"
                        rows="4"
                        maxlength="500"
                        placeholder="이 레시피에 한마디 남겨주세요 😊"
                        required
                    ></textarea>

                </div>


                <div class="comment-form-bottom">

                    <span class="comment-guide">
                        작성한 댓글은 본인과 관리자만 삭제할 수 있어요.
                    </span>


                    <button
                        type="submit"
                        class="comment-submit-button"
                    >
                        댓글 남기기
                    </button>

                </div>

            </form>


            <div class="comment-list">

                ${
                    commentsHTML

                        ? commentsHTML

                        : `
                            <div class="comment-empty">

                                <span>
                                    💭
                                </span>


                                <p>
                                    아직 댓글이 없어요.<br>
                                    첫 댓글을 남겨보세요!
                                </p>

                            </div>
                        `
                }

            </div>

        </section>
    `;
}


// ==================================================
// 💬 댓글 이벤트 연결
// ==================================================

function bindCommentEvents(recipeId) {

    recipeId =
        Number(
            recipeId
        );


    const commentForm =
        document.getElementById(
            "commentForm"
        );


    commentForm
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                await submitComment(
                    recipeId
                );
            }
        );


    document
        .querySelectorAll(
            "[data-comment-delete]"
        )

        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async () => {

                        const commentId =
                            Number(
                                button
                                    .dataset
                                    .commentDelete
                            );


                        await deleteComment(
                            recipeId,
                            commentId
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-reply-open]"
        )

        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const parentId =
                            button
                                .dataset
                                .replyOpen;


                        document
                            .querySelector(
                                `[data-reply-form="${parentId}"]`
                            )
                            ?.classList
                            .remove(
                                "hidden"
                            );


                        button
                            .classList
                            .add(
                                "hidden"
                            );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-reply-cancel]"
        )

        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const parentId =
                            button
                                .dataset
                                .replyCancel;


                        const form =
                            document.querySelector(
                                `[data-reply-form="${parentId}"]`
                            );


                        form
                            ?.classList
                            .add(
                                "hidden"
                            );


                        form
                            ?.reset();


                        document
                            .querySelector(
                                `[data-reply-open="${parentId}"]`
                            )
                            ?.classList
                            .remove(
                                "hidden"
                            );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-reply-form]"
        )

        .forEach(
            form => {

                form.addEventListener(
                    "submit",
                    async event => {

                        event.preventDefault();


                        const parentId =
                            Number(
                                form
                                    .dataset
                                    .replyForm
                            );


                        const textarea =
                            form.querySelector(
                                ".comment-reply-input"
                            );


                        await submitReply(
                            recipeId,
                            parentId,
                            textarea
                        );
                    }
                );
            }
        );
}


// ==================================================
// 💬 원댓글 작성
// ==================================================

async function submitComment(recipeId) {

    if (
        commentBusy
    ) {

        return;
    }


    if (!currentUser) {

        const ready =
            await ensureUserSession();


        if (!ready) {

            showToast(
                "댓글 기능을 준비하지 못했어요."
            );


            return;
        }
    }


    const nicknameInput =
        document.getElementById(
            "commentNickname"
        );


    const contentInput =
        document.getElementById(
            "commentContent"
        );


    const nickname =
        (
            isAdmin
                ? "고장금"
                : nicknameInput
                    ?.value
                    .trim()
        ) || "";


    const content =
        contentInput
            ?.value
            .trim() ||
        "";


    if (!nickname) {

        showToast(
            "닉네임을 입력해주세요."
        );


        nicknameInput
            ?.focus();


        return;
    }


    if (
        nickname ===
            "고장금" &&
        !isAdmin
    ) {

        showToast(
            "'고장금'은 관리자 전용 닉네임이에요."
        );


        nicknameInput
            ?.focus();


        return;
    }


    if (!content) {

        showToast(
            "댓글 내용을 입력해주세요."
        );


        contentInput
            ?.focus();


        return;
    }


    commentBusy =
        true;


    try {

        const {
            error
        } =
            await supabaseClient

                .from(
                    "recipe_comments"
                )

                .insert({

                    recipe_id:
                        Number(
                            recipeId
                        ),

                    user_id:
                        currentUser.id,

                    nickname:
                        nickname,

                    content:
                        content,

                    parent_id:
                        null
                });


        if (error) {

            throw error;
        }


        showToast(
            "댓글을 남겼어요 💬"
        );


        await refreshComments(
            recipeId
        );


    } catch (error) {

        console.error(
            "댓글 작성 실패:",
            error
        );


        showToast(
            "댓글을 등록하지 못했어요."
        );


    } finally {

        commentBusy =
            false;
    }
}


// ==================================================
// 👩🏻‍🍳 관리자 답글 작성
// ==================================================

async function submitReply(
    recipeId,
    parentId,
    textarea
) {

    if (
        replyBusy
    ) {

        return;
    }


    if (
        !isAdmin ||
        !currentUser
    ) {

        showToast(
            "관리자만 답글을 작성할 수 있어요."
        );


        return;
    }


    const content =
        textarea
            ?.value
            .trim() ||
        "";


    if (!content) {

        showToast(
            "답글 내용을 입력해주세요."
        );


        textarea
            ?.focus();


        return;
    }


    replyBusy =
        true;


    try {

        const {
            error
        } =
            await supabaseClient

                .from(
                    "recipe_comments"
                )

                .insert({

                    recipe_id:
                        Number(
                            recipeId
                        ),

                    user_id:
                        currentUser.id,

                    nickname:
                        "고장금",

                    content:
                        content,

                    parent_id:
                        Number(
                            parentId
                        )
                });


        if (error) {

            throw error;
        }


        showToast(
            "답글을 남겼어요 ⭐"
        );


        await refreshComments(
            recipeId
        );


    } catch (error) {

        console.error(
            "답글 작성 실패:",
            error
        );


        showToast(
            "답글을 등록하지 못했어요."
        );


    } finally {

        replyBusy =
            false;
    }
}


// ==================================================
// 🗑️ 댓글 삭제
// ==================================================

async function deleteComment(
    recipeId,
    commentId
) {

    const comments =
        commentsByRecipe.get(
            Number(
                recipeId
            )
        ) || [];


    const comment =
        comments.find(
            item =>
                Number(
                    item.id
                ) ===
                Number(
                    commentId
                )
        );


    if (!comment) {

        showToast(
            "댓글 정보를 찾지 못했어요."
        );


        return;
    }


    const canDelete =
        Boolean(
            currentUser &&
            (
                comment.user_id ===
                currentUser.id
                ||
                isAdmin
            )
        );


    if (!canDelete) {

        showToast(
            "이 댓글을 삭제할 권한이 없어요."
        );


        return;
    }


    const answer =
        confirm(
            comment.parent_id ===
                null

                ? "이 댓글을 삭제할까요?\n답글이 있다면 함께 삭제돼요."

                : "이 답글을 삭제할까요?"
        );


    if (!answer) {

        return;
    }


    const {
        error
    } =
        await supabaseClient

            .from(
                "recipe_comments"
            )

            .delete()

            .eq(
                "id",
                Number(
                    commentId
                )
            );


    if (error) {

        console.error(
            "댓글 삭제 실패:",
            error
        );


        showToast(
            "댓글을 삭제하지 못했어요."
        );


        return;
    }


    showToast(
        comment.parent_id ===
            null
            ? "댓글을 삭제했어요."
            : "답글을 삭제했어요."
    );


    await refreshComments(
        recipeId
    );
}


// ==================================================
// 💬 댓글만 새로고침
// ==================================================

async function refreshComments(recipeId) {

    await loadComments(
        recipeId
    );


    renderDetail(
        recipeId
    );
}
// ==================================================
// 📸 새 사진 선택
// ==================================================

recipeImage.addEventListener(
    "change",
    event => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            showToast(
                "이미지 파일만 선택해주세요."
            );

            recipeImage.value = "";

            return;
        }

        originalImageFile =
            file;

        openCropModal(
            file
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
        .remove(
            "hidden"
        );

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
        .add(
            "hidden"
        );

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

    if (currentImage) {

        imagePreview.src =
            currentImage;

        imagePreviewWrapper
            .classList
            .remove(
                "hidden"
            );

        return;
    }

    if (
        selectedImageFile &&
        croppedPreviewURL
    ) {

        imagePreview.src =
            croppedPreviewURL;

        imagePreviewWrapper
            .classList
            .remove(
                "hidden"
            );

        return;
    }

    imagePreview.src =
        "";

    imagePreviewWrapper
        .classList
        .add(
            "hidden"
        );
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

        cropper.zoom(
            difference *
            0.01
        );

        lastZoomSliderValue =
            value;
    }
);


// ==================================================
// 회전
// ==================================================

rotateLeftButton.addEventListener(
    "click",
    () => {

        cropper?.rotate(
            -90
        );
    }
);


rotateRightButton.addEventListener(
    "click",
    () => {

        cropper?.rotate(
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
                        `recipe-${Date.now()}.webp`,
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
                    .remove(
                        "hidden"
                    );

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

        if (
            originalImageFile
        ) {

            openCropModal(
                originalImageFile
            );

            return;
        }

        if (
            currentImage
        ) {

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
                        `recipe-edit-${Date.now()}`,
                        {
                            type:
                                blob.type ||
                                "image/webp"
                        }
                    );

                openCropModal(
                    originalImageFile
                );

            } catch (error) {

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
            .add(
                "hidden"
            );

        showToast(
            "사진을 삭제했어요. 저장하면 반영돼요."
        );
    }
);


// ==================================================
// 사진 편집 모달 버튼
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

    if (
        file.type ===
        "image/webp"
    ) {

        return file;
    }

    return new Promise(
        (
            resolve,
            reject
        ) => {

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
                                width >
                                    MAX_SIZE ||
                                height >
                                    MAX_SIZE
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

async function uploadRecipeImage(file) {

    const compressed =
        await compressImage(
            file
        );

    const fileName =
        `${Date.now()}-${crypto.randomUUID()}.webp`;

    const filePath =
        `recipes/${fileName}`;

    const {
        error
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

    if (error) {

        console.error(
            "사진 업로드 실패:",
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
                "recipe-images"
            )
            .getPublicUrl(
                filePath
            );

    return {
        url:
            data.publicUrl,

        path:
            filePath
    };
}


// ==================================================
// Storage 사진 삭제
// ==================================================

async function deleteStorageImage(path) {

    if (!path) {
        return;
    }

    const {
        error
    } =
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
// 🍳 레시피 카드 출력
// ==================================================

function renderRecipes() {

    let filteredRecipes =
        [...recipes];


    // 카테고리 필터

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

                    const text =
                        [
                            recipe.name,
                            recipe.description,
                            recipe.ingredients.join(
                                " "
                            )
                        ]
                        .join(
                            " "
                        )
                        .toLowerCase();

                    return text.includes(
                        keyword
                    );
                }
            );
    }


    // 즐겨찾기만

    if (
        favoriteOnly
    ) {

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
            (
                a,
                b
            ) =>
                b.createdAt -
                a.createdAt
        );
    }

    if (
        sortSelect.value ===
        "oldest"
    ) {

        filteredRecipes.sort(
            (
                a,
                b
            ) =>
                a.createdAt -
                b.createdAt
        );
    }

    if (
        sortSelect.value ===
        "name"
    ) {

        filteredRecipes.sort(
            (
                a,
                b
            ) =>
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
            .remove(
                "hidden"
            );

        return;
    }

    emptyState
        .classList
        .add(
            "hidden"
        );


    filteredRecipes.forEach(
        recipe => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "recipe-card";


            const liked =
                likedRecipeIds.has(
                    recipe.id
                );

            const likeCount =
                likeCounts.get(
                    recipe.id
                ) || 0;


            const imageHTML =
                recipe.image

                    ? `
                        <img
                            src="${escapeHTML(
                                recipe.image
                            )}"
                            alt="${escapeHTML(
                                recipe.name
                            )}"
                        >
                    `

                    : `
                        <div class="recipe-image-placeholder">
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
                        aria-label="즐겨찾기"
                        title="내 즐겨찾기"
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
                            ${getCategoryIcon(
                                recipe.category
                            )}
                            ${escapeHTML(
                                recipe.category
                            )}
                        </span>


                        <span class="recipe-time">
                            ${
                                recipe.time

                                    ? `⏱ ${escapeHTML(
                                        recipe.time
                                    )}`

                                    : ""
                            }
                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(
                            recipe.name
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            recipe.description ||
                            "고장금의 맛있는 레시피"
                        )}
                    </p>


                    <div class="recipe-card-bottom">

                        <button
                            type="button"
                            class="
                                recipe-like-button
                                ${
                                    liked
                                        ? "active"
                                        : ""
                                }
                            "
                            data-recipe-id="${recipe.id}"
                            aria-pressed="${liked}"
                        >
                            <span class="like-heart">
                                ${
                                    liked
                                        ? "♥"
                                        : "♡"
                                }
                            </span>

                            <span class="like-text">
                                좋아요
                            </span>

                            <span class="like-count">
                                ${likeCount}
                            </span>
                        </button>

                    </div>

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


            const favorite =
                card.querySelector(
                    ".favorite-button"
                );

            favorite
                ?.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        toggleFavorite(
                            recipe.id
                        );
                    }
                );


            const likeButton =
                card.querySelector(
                    ".recipe-like-button"
                );

            likeButton
                ?.addEventListener(
                    "click",
                    async event => {

                        event.stopPropagation();

                        await toggleLike(
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
        .remove(
            "hidden"
        );

    document.body.style.overflow =
        "hidden";
}


function closeRecipeModal() {

    recipeModal
        .classList
        .add(
            "hidden"
        );

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
        .add(
            "hidden"
        );

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
                .split(
                    "\n"
                )
                .map(
                    item =>
                        item.trim()
                )
                .filter(
                    Boolean
                );


        const steps =
            recipeSteps
                .value
                .split(
                    "\n"
                )
                .map(
                    item =>
                        item.trim()
                )
                .filter(
                    Boolean
                );


        let imageUrl =
            currentImage;

        let imagePath =
            currentImagePath;

        let newlyUploadedPath =
            "";


        try {

            if (
                selectedImageFile
            ) {

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
                    recipeCategory
                        .value,

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

                ingredients,

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


            if (id) {

                const numericId =
                    Number(id);

                const oldRecipe =
                    recipes.find(
                        recipe =>
                            recipe.id ===
                            numericId
                    );


                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "recipes"
                        )
                        .update(
                            recipeData
                        )
                        .eq(
                            "id",
                            numericId
                        );


                if (error) {
                    throw error;
                }


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

            } else {

                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "recipes"
                        )
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

            await loadLikes();


        } catch (error) {

            console.error(
                "레시피 저장 실패:",
                error
            );


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
// 💬 상세보기 열기
// 댓글을 먼저 불러온 뒤 상세화면 표시
// ==================================================

async function openDetail(id) {

    id =
        Number(id);


    await loadComments(
        id
    );


    renderDetail(
        id
    );


    detailModal
        .classList
        .remove(
            "hidden"
        );


    document.body.style.overflow =
        "hidden";
}


// ==================================================
// 상세 내용 출력
// ==================================================

function renderDetail(id) {

    id =
        Number(id);


    const recipe =
        recipes.find(
            recipe =>
                recipe.id ===
                id
        );


    if (!recipe) {
        return;
    }


    const liked =
        likedRecipeIds.has(
            id
        );


    const likeCount =
        likeCounts.get(
            id
        ) || 0;


    const imageHTML =
        recipe.image

            ? `
                <img
                    class="detail-image"
                    src="${escapeHTML(
                        recipe.image
                    )}"
                    alt="${escapeHTML(
                        recipe.name
                    )}"
                >
            `

            : `
                <div class="detail-placeholder">
                    🍳
                </div>
            `;


    const ingredientsHTML =
        recipe.ingredients
            .map(
                ingredient => `
                    <li>
                        ${escapeHTML(
                            ingredient
                        )}
                    </li>
                `
            )
            .join(
                ""
            );


    const stepsHTML =
        recipe.steps
            .map(
                step => `
                    <li>
                        ${escapeHTML(
                            step
                        )}
                    </li>
                `
            )
            .join(
                ""
            );


    detailBody.innerHTML = `

        ${imageHTML}


        <div class="detail-inner">

            <div class="detail-badges">

                <span class="detail-badge">
                    ${getCategoryIcon(
                        recipe.category
                    )}
                    ${escapeHTML(
                        recipe.category
                    )}
                </span>


                ${
                    recipe.time

                        ? `
                            <span class="detail-badge">
                                ⏱
                                ${escapeHTML(
                                    recipe.time
                                )}
                            </span>
                        `

                        : ""
                }

            </div>


            <h2>
                ${escapeHTML(
                    recipe.name
                )}
            </h2>


            <p class="detail-description">
                ${escapeHTML(
                    recipe.description
                )}
            </p>


            <div class="detail-reaction-row">

                <button
                    type="button"
                    id="detailFavoriteButton"
                    class="
                        detail-favorite-button
                        ${
                            recipe.favorite
                                ? "active"
                                : ""
                        }
                    "
                >
                    ${
                        recipe.favorite
                            ? "♥ 즐겨찾기됨"
                            : "♡ 즐겨찾기"
                    }
                </button>


                <button
                    type="button"
                    id="detailLikeButton"
                    class="
                        detail-like-button
                        ${
                            liked
                                ? "active"
                                : ""
                        }
                    "
                    aria-pressed="${liked}"
                >

                    <span>
                        ${
                            liked
                                ? "♥"
                                : "♡"
                        }
                    </span>

                    <span>
                        좋아요
                    </span>

                    <strong>
                        ${likeCount}
                    </strong>

                </button>

            </div>


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
                        <section class="detail-section">

                            <h3>
                                💡 고장금의 요리 팁
                            </h3>

                            <div class="tip-box">
                                ${escapeHTML(
                                    recipe.tip
                                )}
                            </div>

                        </section>
                    `

                    : ""
            }


            ${createCommentsHTML(id)}


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


    // ==================================================
    // 상세 즐겨찾기
    // ==================================================

    document
        .getElementById(
            "detailFavoriteButton"
        )
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                toggleFavorite(
                    id
                );

                renderDetail(
                    id
                );
            }
        );


    // ==================================================
    // 상세 좋아요
    // ==================================================

    document
        .getElementById(
            "detailLikeButton"
        )
        ?.addEventListener(
            "click",
            async event => {

                event.stopPropagation();

                await toggleLike(
                    id
                );
            }
        );


    // ==================================================
    // 관리자 레시피 수정 / 삭제
    // ==================================================

    if (isAdmin) {

        document
            .getElementById(
                "detailEditButton"
            )
            ?.addEventListener(
                "click",
                () =>
                    editRecipe(
                        id
                    )
            );


        document
            .getElementById(
                "detailDeleteButton"
            )
            ?.addEventListener(
                "click",
                () =>
                    deleteRecipe(
                        id
                    )
            );
    }


    // ==================================================
    // 💬 댓글 / 관리자 답글 이벤트 연결
    // ==================================================

    bindCommentEvents(
        id
    );
}


// ==================================================
// 상세보기 닫기
// ==================================================

function closeDetail() {

    detailModal
        .classList
        .add(
            "hidden"
        );

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
                recipe.id ===
                Number(id)
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
        recipe.ingredients.join(
            "\n"
        );

    recipeSteps.value =
        recipe.steps.join(
            "\n"
        );

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


    if (
        currentImage
    ) {

        imagePreview.src =
            currentImage;

        imagePreviewWrapper
            .classList
            .remove(
                "hidden"
            );

    } else {

        imagePreview.src =
            "";

        imagePreviewWrapper
            .classList
            .add(
                "hidden"
            );
    }


    modalTitle.textContent =
        "레시피 수정";

    openRecipeModal();
}


// ==================================================
// 🗑️ 레시피 삭제
// 댓글은 DB ON DELETE CASCADE로 같이 삭제
// ==================================================

async function deleteRecipe(id) {

    if (!isAdmin) {

        showToast(
            "관리자만 삭제할 수 있어요."
        );

        return;
    }


    id =
        Number(id);


    const recipe =
        recipes.find(
            recipe =>
                recipe.id ===
                id
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


    const {
        error
    } =
        await supabaseClient
            .from(
                "recipes"
            )
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


    favoriteIds.delete(
        id
    );

    saveFavoriteIds();


    commentsByRecipe.delete(
        id
    );


    closeDetail();


    showToast(
        "레시피를 삭제했어요."
    );


    await loadRecipes();

    await loadLikes();
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
            .add(
                "active"
            );


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


closeCategoryModalButton.addEventListener(
    "click",
    closeCategoryModal
);


cancelCategoryButton.addEventListener(
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
        .remove(
            "hidden"
        );


    document.body.style.overflow =
        "hidden";
}


function closeLoginModal() {

    loginModal
        .classList
        .add(
            "hidden"
        );


    loginForm.reset();


    restoreBodyScroll();
}


// ==================================================
// 🔐 관리자 로그인
// ==================================================

async function loginAdmin(event) {

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


        currentUser =
            null;

        isAdmin =
            false;


        await ensureUserSession();

        await loadLikes();


        showToast(
            "관리자 계정이 아니에요."
        );


        return;
    }


    currentUser =
        user;

    isAdmin =
        true;


    closeLoginModal();

    updateAdminScreen();

    await loadLikes();


    showToast(
        "관리자로 로그인했어요 🔓"
    );
}


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


    currentUser =
        null;

    isAdmin =
        false;


    updateAdminScreen();


    // 관리자 로그아웃 뒤
    // 새로운 일반 익명 사용자 세션으로 전환

    await ensureUserSession();

    await loadLikes();


    showToast(
        "관리자에서 로그아웃했어요."
    );
}


// ==================================================
// 관리자 화면 표시
// ==================================================

function updateAdminScreen() {

    if (isAdmin) {

        loginButton
            .classList
            .add(
                "hidden"
            );


        logoutButton
            .classList
            .remove(
                "hidden"
            );


        addRecipeButton
            .classList
            .remove(
                "hidden"
            );


        addCategoryButton
            .classList
            .remove(
                "hidden"
            );

    } else {

        loginButton
            .classList
            .remove(
                "hidden"
            );


        logoutButton
            .classList
            .add(
                "hidden"
            );


        addRecipeButton
            .classList
            .add(
                "hidden"
            );


        addCategoryButton
            .classList
            .add(
                "hidden"
            );
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
// Supabase 로그인 상태 변경 감지
// ==================================================

supabaseClient.auth
    .onAuthStateChange(
        (
            _event,
            session
        ) => {

            const user =
                session?.user;


            currentUser =
                user || null;


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
// 현재 열린 모달 확인
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
                !modal
                    .classList
                    .contains(
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


        if (
            !cropModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            cancelCropEditing();

            return;
        }


        if (
            !recipeModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            closeRecipeModal();

            return;
        }


        if (
            !detailModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            closeDetail();

            return;
        }


        if (
            !loginModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            closeLoginModal();

            return;
        }


        if (
            !categoryModal
                .classList
                .contains(
                    "hidden"
                )
        ) {

            closeCategoryModal();
        }
    }
);


// ==================================================
// 토스트 알림
// ==================================================

let toastTimer =
    null;


function showToast(message) {

    toast.textContent =
        message;


    toast
        .classList
        .add(
            "show"
        );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast
                    .classList
                    .remove(
                        "show"
                    );

            },
            2200
        );
}


// ==================================================
// 🚀 시작
// ==================================================

async function startApp() {

    // 1. 개인 즐겨찾기

    loadFavoriteIds();


    // 2. 관리자 또는 익명 사용자 세션

    await ensureUserSession();


    // 3. 카테고리

    await loadCategories();


    // 4. 레시피

    await loadRecipes();


    // 5. 공개 좋아요

    await loadLikes();
}


startApp();

