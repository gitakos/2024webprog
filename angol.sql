-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Feb 20. 11:25
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.0.28

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
  `szazalekos_eredmeny` varchar(255) NOT NULL,
  `datum` date NOT NULL,
  `feladatsorid` int(255) NOT NULL,
  `megadott_valaszok` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`megadott_valaszok`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `feladatsor`
--

CREATE TABLE `feladatsor` (
  `id` int(11) NOT NULL,
  `feladatok` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`feladatok`)),
  `mikori_erettsegi` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `letrehozas` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `feladatsor`
--
ALTER TABLE `feladatsor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

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
