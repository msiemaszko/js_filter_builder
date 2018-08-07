<?php
    // exit( "<pre>".print_r($_POST, true)."</pre>" );    
    $site_current = $_POST["site_current"]; // aktualna strona
    $site_count = 10;                         // ilosc stron
    
    $html_result = (isset($_POST["filtering"])) ?"
    <table>
    <tr>
        <th>column</th>
        <th>operator</th>
        <th>value_1</th>
        <th>value_2</th>
    </tr>".
    join( "",
        array_map( function($filtering){
        $filtering = json_decode($filtering);
        return  "
            <tr>
                <td>{$filtering -> column}</td>
                <td>{$filtering -> operator}</td>
                <td>{$filtering -> value_1}</td>
                <td>{$filtering -> value_2}</td>
            </tr>";
    }, $_POST["filtering"])) . "
    </table>" : "";

    // zwracana tablica
    $outp = [
        "html_result"  => $html_result,
        "site_current" => (int) $site_current,
        "site_count"   => $site_count
    ];
    // sleep(2);
    echo json_encode($outp);
?>