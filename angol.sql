-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Ápr 15. 07:27
-- Kiszolgáló verziója: 10.4.20-MariaDB
-- PHP verzió: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `angol`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `eredmenyek`
--

CREATE TABLE `eredmenyek` (
  `id` int(255) NOT NULL,
  `felhasznaloid` int(255) NOT NULL,
  `pontszam` int(255) NOT NULL,
  `datum` date DEFAULT current_timestamp(),
  `feladatsorid` int(255) NOT NULL,
  `megadott_valaszok` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `feladatsor`
--

CREATE TABLE `feladatsor` (
  `id` int(11) NOT NULL,
  `feladatok` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ev` int(11) NOT NULL,
  `honap` varchar(50) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `feladatleiras` text NOT NULL,
  `valaszok` longtext NOT NULL,
  `valaszDB` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `feladatsor`
--

INSERT INTO `feladatsor` (`id`, `feladatok`, `ev`, `honap`, `cim`, `feladatleiras`, `valaszok`, `valaszDB`) VALUES
(1, 'In Dutch the @ sign is called a “monkey tail”, in (0) ______ (Hungary) a “maggot”, in Danish an “elephant’s trunk”, and in (9) ______ (Wales) a “snail”. Appearing everywhere now in emails, the @ sign has history. \n  \nThe first (10) ______ (record) use was in The Mannasses Chronicle in 1345, where an @ sign is the first letter in the word ‘Amen’. By the 16th century, in southern (11) ______ (Europe) documents of trade, the sign represented amphora, a storage jar (12) _______ (use) since Roman times. By the 18th century it was called ‘commercial A’ and meant ‘at the rate of’  (eg.: 10 hats @ 1 shilling = 10 shillings). \n  \nIt didn’t make it onto the earliest typewriters but was included by 1889, when it became a standard character. By 1963 @ was included in the new (13) _______ (international) recognised character set. \n  \nIn 1971 computer (14) _______ (programme) Ray Tomlinson was at work on Arpanet, the prototype of the internet. He added some of his own code to an (15) _______ (exist) programme and sent a message from one computer to (16) ______ (other) – the first email. Ray needed a character to separate the message’s recipient from the computer it would arrive at, and  (17) _______ (look) down at his teletype keyboard, he chose the @ symbol and changed the world forever.', 2021, 'október', 'A WELL-KNOWN SIGN', 'Task 2                                                                       •	You are going to read an article about the origins of the @ sign. Some words are missing from the text.  •	Use the words in brackets to form the words that fit in the gaps (9-17).  •	Then write the appropriate form of these words on the dotted lines after the text.  •	There might be cases when you do not have to change the word in brackets.  •	Use only one word for each gap.  •	There is an example (0) at the beginning. ', 'teszt1/teszt2;teszt3', 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `id` int(255) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `jog` varchar(255) NOT NULL,
  `letrehozas` date NOT NULL,
  `megnev` varchar(255) NOT NULL DEFAULT 'Cica virág nem választottál nevet'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`id`, `nev`, `email`, `jelszo`, `jog`, `letrehozas`, `megnev`) VALUES
(1, 'jozsi', 'jozsi@gmail.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'admin', '2024-03-05', ''),
(2, 'haha123', 'email@email.email', 'd8172b5b9f06f9173aff5d57e825c60d24aa06c695e86a0e17fedc48ff420807', 'user', '2024-04-08', '');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `eredmenyek`
--
ALTER TABLE `eredmenyek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feladatid` (`feladatsorid`),
  ADD KEY `fk_felhasznaloid` (`felhasznaloid`);

--
-- A tábla indexei `feladatsor`
--
ALTER TABLE `feladatsor`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `eredmenyek`
--
ALTER TABLE `eredmenyek`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `feladatsor`
--
ALTER TABLE `feladatsor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `eredmenyek`
--
ALTER TABLE `eredmenyek`
  ADD CONSTRAINT `fk_feladatid` FOREIGN KEY (`feladatsorid`) REFERENCES `feladatsor` (`id`),
  ADD CONSTRAINT `fk_felhasznaloid` FOREIGN KEY (`felhasznaloid`) REFERENCES `felhasznalo` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
