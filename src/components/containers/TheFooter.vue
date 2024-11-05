<template>
    <div>
        <div class="footer-line"></div>
        <footer class="app-footer bg-light text-center py-3">
            <div class="container">
                <p>&copy; 2024 Initium. All Rights Reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'TheFooter',
};
</script>

<style scoped>
.app-footer p,
.app-footer a {
    margin: 0;
    padding: 0;
    height: 36px;
    font-size: 12px;
    text-decoration: none;
    color: #4da3d4;
}

.footer-line {
    height: 1px;
    background-color: #e0e0e0;
    margin-top: 0px;
}
</style>
