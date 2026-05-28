<?php
/** @var \App\Model\Game $game */
/** @var \App\Service\Router $router */

$title = "Game Details ({$game->getTitle()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $game->getTitle() ?></h1>
    <article>
        <strong>Developer:</strong> <?= $game->getDeveloper() ?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('game-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('game-edit', ['id'=> $game->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';