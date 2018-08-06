<table>
        <tr>
            <th>column</th>
            <th>operator</th>
            <th>value_1</th>
            <th>value_2</th>
        </tr>
    <?php
        // echo "<pre>".print_r($_POST, true)."</pre>";
        if ($_POST)
        foreach ( $_POST["data"] as $obj) {
            $obj = json_decode($obj);
            echo "
            <tr>
                <td>{$obj->column}</td>
                <td>{$obj->operator}</td>
                <td>{$obj->value_1}</td>
                <td>{$obj->value_2}</td>
            </tr>
            ";
        }
    ?>
</table>