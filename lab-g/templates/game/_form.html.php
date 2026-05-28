<?php
/** @var $game \App\Model\Game */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="game[title]" value="<?= $game ? $game->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="developer">Developer</label>
    <textarea id="developer" name="game[developer]"><?= $game ? $game->getDeveloper() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>