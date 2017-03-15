<?php
/**
 * Created by IntelliJ IDEA.
 * User: liutao
 * Date: 2017/3/11
 * Time: 下午5:07
 */

$str = '';
$isMatched = preg_match('/[^\x00-\xff]/', $str, $matches);
var_dump($isMatched, $matches);