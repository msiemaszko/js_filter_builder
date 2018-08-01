<!DOCTYPE html>
<html>
<head>
    <style>
        table {
            border: 1px solid grey;
            border-collapse: collapse;
            margin: 50px auto;
        }

        td, th {
            border: 1px solid grey;
            text-align: center;
            padding: 5px;
        }
            
    </style>
</head>
<body>
    <table>
            <tr>
                <th>column</th>
                <th>operator</th>
                <th>value_1</th>
                <th>value_2</th>
            </tr>
        <?php
            for ($i = 0; $i <= (count($_POST["column"])-1); $i++ ) {
                echo "
                <tr>
                    <td>{$_POST["column"][$i]}</td>
                    <td>{$_POST["operator"][$i]}</td>
                    <td>{$_POST["value_1"][$i]}</td>
                    <td>{$_POST["value_2"][$i]}</td>
                </tr>";
            }
        ?>
    </table>
</body>
</html>