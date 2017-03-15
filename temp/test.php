<?php
/**
 * Created by IntelliJ IDEA.
 * User: liutao
 * Date: 2017/3/10
 * Time: 下午1:48
 */


ob_start();
echo "asdf".PHP_EOL;

ob_end_clean();
//ob_end_flush();
echo "asdfasdfasdf";

