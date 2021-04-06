<?php
/**
 * @filename index.php
 * @author Abhishek Kumar
 **/

// require 'lib/flight/autoload.php';
// require 'lib/Spout/Autoloader/autoload.php';

require '../vendor/mikecao/flight/flight/autoload.php';
require '../vendor/box/spout/src/Spout/Autoloader/autoload.php';

require 'config.php';

use Box\Spout\Common\Type;
use Box\Spout\Reader\ReaderFactory;
use flight\Engine;

header('Content-type: application/json');

class Tracker {

    public function __construct($instance) {
        $this->enzin = $instance;
    }

    private function respond($cargo) {
        if ($this->enzin->request()->query['pp']) {
            $response = json_encode($cargo, JSON_PRETTY_PRINT);
        } else {
            $response = json_encode($cargo);
        }
        if ($this->enzin->request()->query['cb']) {
            $response = $this->enzin->request()->query['cb'] . '(' . $response . ')';
        }
        echo $response;
    }

    public function jira() {
        // echo 'Tracker::jira';

        $reader = ReaderFactory::create(Type::XLSX);

        $filePath = DB_JIRA_TRACKER;
        $reader->open($filePath);

        $output = array();
        foreach ($reader->getSheetIterator() as $sheet) {
            foreach ($sheet->getRowIterator() as $row) {
                array_push($output, $row);
            }
        }

        $reader->close();
        $this->respond($output);
    }

    public function zendesk() {
        // echo 'Tracker::zendesk';
        $reader = ReaderFactory::create(Type::XLSX);

        $filePath = DB_ZENDESK_TRACKER;
        $reader->open($filePath);

        $output = array();
        foreach ($reader->getSheetIterator() as $sheet) {
            foreach ($sheet->getRowIterator() as $row) {
                array_push($output, $row);
            }
        }

        $reader->close();
        $this->respond($output);
    }
}

$app = new Engine();
$tracker = new Tracker($app);

$app->route('GET|POST /jira', array($tracker, 'jira'));
$app->route('GET|POST /zendesk', array($tracker, 'zendesk'));

$app->start();

?>


