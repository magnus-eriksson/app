<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Moments</title>
    <link rel="stylesheet" type="text/css" href="/static/main.css" />
</head>

<body>


    <div id="app">

        <header id="app-header">

            <a href="<?= $this->route('home') ?>" class="brand">Brand</a>

            <nav>
                <a href="<?= $this->route('home') ?>">Home</a>
            </nav>

            <nav>
                <a href="#">Sign out</a>
            </nav>

        </header>

        <section id="app-main">

            <div id="app-sidebar">
                Sidebar
            </div>

            <div id="app-content">
                <?= $this->section('content') ?>
            </div>

        </section>

    </div>

    <script src="/static/main.js"></script>
</body>

</html>