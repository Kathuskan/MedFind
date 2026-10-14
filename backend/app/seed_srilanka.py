"""Comprehensive Sri Lanka Seeder with all 25 Districts, authentic pharmacies, medicines & stock."""

import asyncio
from datetime import datetime, timezone, timedelta
import random
from sqlalchemy import select, delete

from app.core.db import AsyncSessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.pharmacy import Pharmacy
from app.models.medicine import Medicine
from app.models.stock import Stock, StockStatus
from app.models.hold import Hold, HoldStatus
from app.models.enquiry import Enquiry, EnquiryStatus


# All 25 Administrative Districts of Sri Lanka with realistic pharmacy data
SRI_LANKA_DISTRICT_PHARMACIES = [
    # Western Province
    {
        "name": "State Pharmaceuticals Corporation (Rajya Osusala - Colombo 07)",
        "license": "SL-NMRA-COL-001",
        "address": "No. 45, Dharmapala Mawatha, Colombo 07",
        "city": "Colombo",
        "postal_code": "00700",
        "lat": 6.9147,
        "lng": 79.8654,
        "phone": "+94 11 268 7788",
        "email": "osusala.colombo7@spc.lk",
        "hours": "24 Hours Open",
    },
    {
        "name": "Asiri Central Hospital Dispensary",
        "license": "SL-NMRA-COL-002",
        "address": "114 Norris Canal Road, Colombo 10",
        "city": "Colombo",
        "postal_code": "01000",
        "lat": 6.9214,
        "lng": 79.8680,
        "phone": "+94 11 466 5500",
        "email": "pharmacy@asiri.lk",
        "hours": "24 Hours Open",
    },
    {
        "name": "Lanka Hospitals 24h Pharmacy",
        "license": "SL-NMRA-COL-003",
        "address": "578 Elvitigala Mawatha, Narahenpita, Colombo 05",
        "city": "Colombo",
        "postal_code": "00500",
        "lat": 6.8969,
        "lng": 79.8776,
        "phone": "+94 11 543 0000",
        "email": "dispensary@lankahospitals.com",
        "hours": "24 Hours Open",
    },
    {
        "name": "Cargills Health & Beauty - Negombo",
        "license": "SL-NMRA-GAM-001",
        "address": "182 Main Street, Negombo",
        "city": "Gampaha",
        "postal_code": "11500",
        "lat": 7.2083,
        "lng": 79.8358,
        "phone": "+94 31 222 3450",
        "email": "negombo.dispensary@cargills.lk",
        "hours": "08:00 AM - 10:00 PM",
    },
    {
        "name": "Keells Medicare Pharmacy - Wattala",
        "license": "SL-NMRA-GAM-002",
        "address": "240 Negombo Road, Wattala",
        "city": "Gampaha",
        "postal_code": "11300",
        "lat": 6.9895,
        "lng": 79.8912,
        "phone": "+94 11 293 8810",
        "email": "wattala.health@keells.com",
        "hours": "07:30 AM - 10:30 PM",
    },
    {
        "name": "MediHelp Dispensary & Clinic - Panadura",
        "license": "SL-NMRA-KAL-001",
        "address": "320 Galle Road, Panadura",
        "city": "Kalutara",
        "postal_code": "12500",
        "lat": 6.7133,
        "lng": 79.9075,
        "phone": "+94 38 223 5670",
        "email": "panadura@medihelp.lk",
        "hours": "07:00 AM - 11:00 PM",
    },
    {
        "name": "Singhe Hospitals Pharmacy - Kalutara",
        "license": "SL-NMRA-KAL-002",
        "address": "88 Hospital Road, Nagoda, Kalutara",
        "city": "Kalutara",
        "postal_code": "12000",
        "lat": 6.5854,
        "lng": 79.9607,
        "phone": "+94 34 222 4500",
        "email": "kalutara@singhehospitals.com",
        "hours": "24 Hours Open",
    },

    # Central Province
    {
        "name": "Kandurata Medicare - Kandy City",
        "license": "SL-NMRA-KAN-001",
        "address": "75 Dalada Veediya, Kandy",
        "city": "Kandy",
        "postal_code": "20000",
        "lat": 7.2936,
        "lng": 80.6413,
        "phone": "+94 81 223 4567",
        "email": "kandurata.pharma@medfind.local",
        "hours": "08:00 AM - 09:30 PM",
    },
    {
        "name": "Peradeniya City Chemists",
        "license": "SL-NMRA-KAN-002",
        "address": "112 Peradeniya Road, Peradeniya",
        "city": "Kandy",
        "postal_code": "20400",
        "lat": 7.2710,
        "lng": 80.5960,
        "phone": "+94 81 238 8890",
        "email": "peradeniya@dispensary.lk",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Matale Suwa Sewana Pharmacy",
        "license": "SL-NMRA-MTL-001",
        "address": "42 Trincomalee Street, Matale",
        "city": "Matale",
        "postal_code": "21000",
        "lat": 7.4675,
        "lng": 80.6234,
        "phone": "+94 66 222 3120",
        "email": "matale.suwasewana@medfind.local",
        "hours": "08:30 AM - 08:30 PM",
    },
    {
        "name": "Dambulla Express Dispensary",
        "license": "SL-NMRA-MTL-002",
        "address": "Kurunegala Junction, Dambulla",
        "city": "Matale",
        "postal_code": "21100",
        "lat": 7.8731,
        "lng": 80.6517,
        "phone": "+94 66 228 4400",
        "email": "dambulla.pharma@medfind.local",
        "hours": "24 Hours Open",
    },
    {
        "name": "Hill Country Medicare - Nuwara Eliya",
        "license": "SL-NMRA-NWE-001",
        "address": "15 Queen Elizabeth Drive, Nuwara Eliya",
        "city": "Nuwara Eliya",
        "postal_code": "22200",
        "lat": 6.9497,
        "lng": 80.7891,
        "phone": "+94 52 222 2890",
        "email": "nuwaraeliya.medicare@medfind.local",
        "hours": "08:00 AM - 08:00 PM",
    },
    {
        "name": "Hatton Community Pharmacy",
        "license": "SL-NMRA-NWE-002",
        "address": "64 Dimbulla Road, Hatton",
        "city": "Nuwara Eliya",
        "postal_code": "22000",
        "lat": 6.8916,
        "lng": 80.5956,
        "phone": "+94 51 222 3410",
        "email": "hatton.pharma@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },

    # Southern Province
    {
        "name": "Ruhunu Chemists - Galle Fort",
        "license": "SL-NMRA-GAL-001",
        "address": "28 Church Street, Galle Fort",
        "city": "Galle",
        "postal_code": "80000",
        "lat": 6.0270,
        "lng": 80.2170,
        "phone": "+94 91 224 8899",
        "email": "galle.ruhunu@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Karapitiya Hospital Gate Dispensary",
        "license": "SL-NMRA-GAL-002",
        "address": "Hospital Junction, Karapitiya, Galle",
        "city": "Galle",
        "postal_code": "80000",
        "lat": 6.0680,
        "lng": 80.2280,
        "phone": "+94 91 223 2100",
        "email": "karapitiya.dispensary@medfind.local",
        "hours": "24 Hours Open",
    },
    {
        "name": "Matara Central Pharmacy",
        "license": "SL-NMRA-MAT-001",
        "address": "84 Anagarika Dharmapala Mawatha, Matara",
        "city": "Matara",
        "postal_code": "81000",
        "lat": 5.9549,
        "lng": 80.5550,
        "phone": "+94 41 222 2333",
        "email": "matara.central@medfind.local",
        "hours": "08:00 AM - 09:30 PM",
    },
    {
        "name": "Southern Medicare - Weligama",
        "license": "SL-NMRA-MAT-002",
        "address": "19 Bypass Road, Weligama",
        "city": "Matara",
        "postal_code": "81700",
        "lat": 5.9734,
        "lng": 80.4289,
        "phone": "+94 41 225 1200",
        "email": "weligama.pharma@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Ruhuna Health Mart - Tangalle",
        "license": "SL-NMRA-HAM-001",
        "address": "40 Beliatta Road, Tangalle",
        "city": "Hambantota",
        "postal_code": "82200",
        "lat": 6.0242,
        "lng": 80.7941,
        "phone": "+94 47 224 0550",
        "email": "tangalle.health@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
    {
        "name": "Hambantota Town Chemists",
        "license": "SL-NMRA-HAM-002",
        "address": "12 Main Street, Hambantota",
        "city": "Hambantota",
        "postal_code": "82000",
        "lat": 6.1246,
        "lng": 81.1185,
        "phone": "+94 47 222 0180",
        "email": "hambantota.chemists@medfind.local",
        "hours": "08:00 AM - 08:00 PM",
    },

    # Northern Province
    {
        "name": "Jaffna Central Hospital Dispensary",
        "license": "SL-NMRA-JAF-001",
        "address": "Hospital Road, Jaffna",
        "city": "Jaffna",
        "postal_code": "40000",
        "lat": 9.6615,
        "lng": 80.0255,
        "phone": "+94 21 222 2261",
        "email": "jaffna.hospitalpharma@medfind.local",
        "hours": "24 Hours Open",
    },
    {
        "name": "Nallur Community Pharmacy",
        "license": "SL-NMRA-JAF-002",
        "address": "35 Point Pedro Road, Nallur, Jaffna",
        "city": "Jaffna",
        "postal_code": "40000",
        "lat": 9.6740,
        "lng": 80.0320,
        "phone": "+94 21 221 4450",
        "email": "nallur.pharma@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Kilinochchi Town Pharmacy",
        "license": "SL-NMRA-KIL-001",
        "address": "A9 Highway, Kilinochchi Town",
        "city": "Kilinochchi",
        "postal_code": "44000",
        "lat": 9.3803,
        "lng": 80.3770,
        "phone": "+94 21 228 5520",
        "email": "kilinochchi.pharma@medfind.local",
        "hours": "08:00 AM - 08:00 PM",
    },
    {
        "name": "Mannar City Chemists",
        "license": "SL-NMRA-MNR-001",
        "address": "Main Street, Mannar",
        "city": "Mannar",
        "postal_code": "41000",
        "lat": 8.9810,
        "lng": 79.9044,
        "phone": "+94 23 222 2190",
        "email": "mannar.chemists@medfind.local",
        "hours": "08:00 AM - 07:30 PM",
    },
    {
        "name": "Vavuniya Medicare Centre",
        "license": "SL-NMRA-VAV-001",
        "address": "2nd Cross Street, Vavuniya",
        "city": "Vavuniya",
        "postal_code": "43000",
        "lat": 8.7542,
        "lng": 80.4982,
        "phone": "+94 24 222 2870",
        "email": "vavuniya.medicare@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Mullaitivu People's Dispensary",
        "license": "SL-NMRA-MUL-001",
        "address": "Coastal Road, Mullaitivu",
        "city": "Mullaitivu",
        "postal_code": "42000",
        "lat": 9.2671,
        "lng": 80.8142,
        "phone": "+94 21 229 0110",
        "email": "mullaitivu.dispensary@medfind.local",
        "hours": "08:00 AM - 07:00 PM",
    },

    # Eastern Province
    {
        "name": "Batticaloa Royal Chemists",
        "license": "SL-NMRA-BAT-001",
        "address": "50 Central Road, Batticaloa",
        "city": "Batticaloa",
        "postal_code": "30000",
        "lat": 7.7310,
        "lng": 81.6747,
        "phone": "+94 65 222 2490",
        "email": "batticaloa.royal@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Kattankudy Health Mart",
        "license": "SL-NMRA-BAT-002",
        "address": "Main Street, Kattankudy",
        "city": "Batticaloa",
        "postal_code": "30130",
        "lat": 7.6890,
        "lng": 81.7240,
        "phone": "+94 65 224 5600",
        "email": "kattankudy.health@medfind.local",
        "hours": "08:30 AM - 09:30 PM",
    },
    {
        "name": "Ampara Central Dispensary",
        "license": "SL-NMRA-AMP-001",
        "address": "D.S. Senanayake Street, Ampara",
        "city": "Ampara",
        "postal_code": "32000",
        "lat": 7.2912,
        "lng": 81.6724,
        "phone": "+94 63 222 2310",
        "email": "ampara.central@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
    {
        "name": "Kalmunai Medicare Pharmacy",
        "license": "SL-NMRA-AMP-002",
        "address": "Hospital Road, Kalmunai",
        "city": "Ampara",
        "postal_code": "32300",
        "lat": 7.4120,
        "lng": 81.8260,
        "phone": "+94 67 222 9840",
        "email": "kalmunai.medicare@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Trincomalee Harbour Chemists",
        "license": "SL-NMRA-TRI-001",
        "address": "Dockyard Road, Trincomalee",
        "city": "Trincomalee",
        "postal_code": "31000",
        "lat": 8.5874,
        "lng": 81.2152,
        "phone": "+94 26 222 2270",
        "email": "trinco.chemists@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },

    # North Western Province
    {
        "name": "Wayamba MediCare - Kurunegala",
        "license": "SL-NMRA-KUR-001",
        "address": "18 Colombo Road, Kurunegala",
        "city": "Kurunegala",
        "postal_code": "60000",
        "lat": 7.4863,
        "lng": 80.3623,
        "phone": "+94 37 222 3410",
        "email": "kurunegala.medicare@medfind.local",
        "hours": "07:30 AM - 09:30 PM",
    },
    {
        "name": "Kuliyapitiya Community Pharmacy",
        "license": "SL-NMRA-KUR-002",
        "address": "Main Street, Kuliyapitiya",
        "city": "Kurunegala",
        "postal_code": "60200",
        "lat": 7.4680,
        "lng": 80.0450,
        "phone": "+94 37 228 1290",
        "email": "kuliyapitiya.pharma@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
    {
        "name": "Puttalam City Dispensary",
        "license": "SL-NMRA-PUT-001",
        "address": "Kurunegala Road, Puttalam",
        "city": "Puttalam",
        "postal_code": "61300",
        "lat": 8.0408,
        "lng": 79.8394,
        "phone": "+94 32 226 5340",
        "email": "puttalam.dispensary@medfind.local",
        "hours": "08:00 AM - 08:00 PM",
    },
    {
        "name": "Chilaw Health Plus Pharmacy",
        "license": "SL-NMRA-PUT-002",
        "address": "Market Junction, Chilaw",
        "city": "Puttalam",
        "postal_code": "61000",
        "lat": 7.5758,
        "lng": 79.7953,
        "phone": "+94 32 222 2150",
        "email": "chilaw.health@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },

    # North Central Province
    {
        "name": "Rajarata Health Mart - Anuradhapura",
        "license": "SL-NMRA-ANU-001",
        "address": "Maithripala Senanayake Mawatha, New Town, Anuradhapura",
        "city": "Anuradhapura",
        "postal_code": "50000",
        "lat": 8.3114,
        "lng": 80.4037,
        "phone": "+94 25 222 2340",
        "email": "rajarata.health@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Sacred City Dispensary - Anuradhapura",
        "license": "SL-NMRA-ANU-002",
        "address": "Hospital Road, Anuradhapura",
        "city": "Anuradhapura",
        "postal_code": "50000",
        "lat": 8.3350,
        "lng": 80.3980,
        "phone": "+94 25 223 5510",
        "email": "sacredcity.dispensary@medfind.local",
        "hours": "24 Hours Open",
    },
    {
        "name": "Polonnaruwa Ancient City Chemists",
        "license": "SL-NMRA-POL-001",
        "address": "Hospital Road, Polonnaruwa",
        "city": "Polonnaruwa",
        "postal_code": "51000",
        "lat": 7.9403,
        "lng": 81.0188,
        "phone": "+94 27 222 2180",
        "email": "polonnaruwa.chemists@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
    {
        "name": "Kaduruwela Family Dispensary",
        "license": "SL-NMRA-POL-002",
        "address": "Batticaloa Road, Kaduruwela",
        "city": "Polonnaruwa",
        "postal_code": "51000",
        "lat": 7.9290,
        "lng": 81.0250,
        "phone": "+94 27 222 4900",
        "email": "kaduruwela.pharma@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },

    # Uva Province
    {
        "name": "Badulla Provincial Medicare",
        "license": "SL-NMRA-BAD-001",
        "address": "Lower Street, Badulla",
        "city": "Badulla",
        "postal_code": "90000",
        "lat": 6.9934,
        "lng": 81.0550,
        "phone": "+94 55 222 2250",
        "email": "badulla.medicare@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Bandarawela Highland Pharmacy",
        "license": "SL-NMRA-BAD-002",
        "address": "Dharmapala Mawatha, Bandarawela",
        "city": "Badulla",
        "postal_code": "90100",
        "lat": 6.8306,
        "lng": 80.9856,
        "phone": "+94 57 222 2380",
        "email": "bandarawela.highland@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
    {
        "name": "Monaragala Green Cross Dispensary",
        "license": "SL-NMRA-MON-001",
        "address": "Main Street, Monaragala",
        "city": "Monaragala",
        "postal_code": "91000",
        "lat": 6.8728,
        "lng": 81.3507,
        "phone": "+94 55 227 6230",
        "email": "monaragala.greencross@medfind.local",
        "hours": "08:00 AM - 08:00 PM",
    },
    {
        "name": "Wellawaya Central Chemists",
        "license": "SL-NMRA-MON-002",
        "address": "Ella Road, Wellawaya",
        "city": "Monaragala",
        "postal_code": "91200",
        "lat": 6.7410,
        "lng": 81.1030,
        "phone": "+94 55 227 4100",
        "email": "wellawaya.chemists@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },

    # Sabaragamuwa Province
    {
        "name": "Sabaragamuwa Gem City Pharmacy - Ratnapura",
        "license": "SL-NMRA-RAT-001",
        "address": "Main Street, Ratnapura",
        "city": "Ratnapura",
        "postal_code": "70000",
        "lat": 6.7056,
        "lng": 80.3847,
        "phone": "+94 45 222 2390",
        "email": "ratnapura.gemcity@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Embilipitiya Health Care Dispensary",
        "license": "SL-NMRA-RAT-002",
        "address": "Pallegama, Embilipitiya",
        "city": "Ratnapura",
        "postal_code": "70200",
        "lat": 6.3420,
        "lng": 80.8520,
        "phone": "+94 47 223 0450",
        "email": "embilipitiya.health@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
    {
        "name": "Kegalle Valley Pharmacy",
        "license": "SL-NMRA-KEG-001",
        "address": "Kandy Road, Kegalle",
        "city": "Kegalle",
        "postal_code": "71000",
        "lat": 7.2513,
        "lng": 80.3464,
        "phone": "+94 35 222 2210",
        "email": "kegalle.valley@medfind.local",
        "hours": "08:00 AM - 09:00 PM",
    },
    {
        "name": "Mawanella Central Chemists",
        "license": "SL-NMRA-KEG-002",
        "address": "Hemmathagama Road, Mawanella",
        "city": "Kegalle",
        "postal_code": "71500",
        "lat": 7.2520,
        "lng": 80.4480,
        "phone": "+94 35 224 6300",
        "email": "mawanella.chemists@medfind.local",
        "hours": "08:00 AM - 08:30 PM",
    },
]

# Rich assortment of common Sri Lankan prescription and OTC medicines
SRI_LANKA_MEDICINES = [
    {
        "brand_name": "Amoxil",
        "generic_name": "Amoxicillin Trihydrate",
        "dosage_form": "Capsule",
        "strength": "500mg",
        "manufacturer": "GlaxoSmithKline",
        "description": "Broad-spectrum beta-lactam antibiotic used to treat bacterial infections.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 32.50,
    },
    {
        "brand_name": "Augmentin",
        "generic_name": "Amoxicillin & Clavulanate Potassium",
        "dosage_form": "Tablet",
        "strength": "625mg",
        "manufacturer": "GlaxoSmithKline",
        "description": "Combination antibiotic for respiratory, ear, sinus, and soft tissue infections.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 145.00,
    },
    {
        "brand_name": "Panadol Extra",
        "generic_name": "Paracetamol & Caffeine",
        "dosage_form": "Tablet",
        "strength": "500mg/65mg",
        "manufacturer": "Haleon Sri Lanka",
        "description": "Dual-action pain relief for headaches, migraine, toothaches, and bodily aches.",
        "requires_prescription": False,
        "is_controlled": False,
        "typical_price": 12.00,
    },
    {
        "brand_name": "Paracetamol SPMC",
        "generic_name": "Paracetamol",
        "dosage_form": "Tablet",
        "strength": "500mg",
        "manufacturer": "State Pharmaceuticals Manufacturing Corporation (SPMC)",
        "description": "National formulary essential analgesic and antipyretic.",
        "requires_prescription": False,
        "is_controlled": False,
        "typical_price": 5.50,
    },
    {
        "brand_name": "Glucophage",
        "generic_name": "Metformin Hydrochloride",
        "dosage_form": "Tablet",
        "strength": "500mg",
        "manufacturer": "Merck",
        "description": "First-line oral antidiabetic medication for Type 2 Diabetes management.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 18.00,
    },
    {
        "brand_name": "Glucophage XR",
        "generic_name": "Metformin Hydrochloride",
        "dosage_form": "Tablet",
        "strength": "850mg",
        "manufacturer": "Merck",
        "description": "Extended-release metformin for continuous glycemic control.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 28.00,
    },
    {
        "brand_name": "Lipitor",
        "generic_name": "Atorvastatin Calcium",
        "dosage_form": "Tablet",
        "strength": "20mg",
        "manufacturer": "Pfizer",
        "description": "HMG-CoA reductase inhibitor (statin) for hypercholesterolemia and cardiac risk reduction.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 68.00,
    },
    {
        "brand_name": "Atocor",
        "generic_name": "Atorvastatin Calcium",
        "dosage_form": "Tablet",
        "strength": "40mg",
        "manufacturer": "Dr. Reddy's",
        "description": "High potency lipid-lowering medication for cardiovascular therapy.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 95.00,
    },
    {
        "brand_name": "Norvasc",
        "generic_name": "Amlodipine Besylate",
        "dosage_form": "Tablet",
        "strength": "5mg",
        "manufacturer": "Pfizer",
        "description": "Dihydropyridine calcium channel blocker for hypertension and coronary artery disease.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 24.00,
    },
    {
        "brand_name": "Cozaar",
        "generic_name": "Losartan Potassium",
        "dosage_form": "Tablet",
        "strength": "50mg",
        "manufacturer": "Organon",
        "description": "Angiotensin II receptor blocker (ARB) for blood pressure control and renal protection.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 38.00,
    },
    {
        "brand_name": "Losec",
        "generic_name": "Omeprazole",
        "dosage_form": "Capsule",
        "strength": "20mg",
        "manufacturer": "AstraZeneca",
        "description": "Proton pump inhibitor (PPI) for gastric reflux, GERD, and peptic ulcers.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 22.00,
    },
    {
        "brand_name": "Pantocid",
        "generic_name": "Pantoprazole Sodium",
        "dosage_form": "Tablet",
        "strength": "40mg",
        "manufacturer": "Sun Pharma",
        "description": "Potent acid suppressant for severe acidity, erosive esophagitis, and gastritis.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 34.00,
    },
    {
        "brand_name": "Ventolin Evohaler",
        "generic_name": "Salbutamol Sulfate",
        "dosage_form": "Inhaler",
        "strength": "100mcg",
        "manufacturer": "GlaxoSmithKline",
        "description": "Short-acting beta-2 agonist (reliever inhaler) for asthma attacks and bronchospasm.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 850.00,
    },
    {
        "brand_name": "Zyrtec",
        "generic_name": "Cetirizine Dihydrochloride",
        "dosage_form": "Tablet",
        "strength": "10mg",
        "manufacturer": "UCB Pharma",
        "description": "Second-generation antihistamine for seasonal rhinitis, allergy, and chronic urticaria.",
        "requires_prescription": False,
        "is_controlled": False,
        "typical_price": 16.50,
    },
    {
        "brand_name": "Zithromax",
        "generic_name": "Azithromycin Dihydrate",
        "dosage_form": "Tablet",
        "strength": "500mg",
        "manufacturer": "Pfizer",
        "description": "Macrolide antibiotic with convenient 3-day once-daily regimen.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 210.00,
    },
    {
        "brand_name": "Cipro",
        "generic_name": "Ciprofloxacin Hydrochloride",
        "dosage_form": "Tablet",
        "strength": "500mg",
        "manufacturer": "Bayer",
        "description": "Fluoroquinolone antibiotic for urinary tract, gastrointestinal, and systemic infections.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 62.00,
    },
    {
        "brand_name": "Lantus SoloStar",
        "generic_name": "Insulin Glargine",
        "dosage_form": "Injection",
        "strength": "100 units/ml",
        "manufacturer": "Sanofi",
        "description": "Long-acting human insulin analogue pen for once-daily basal glycemic coverage.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 3850.00,
    },
    {
        "brand_name": "Brufen",
        "generic_name": "Ibuprofen",
        "dosage_form": "Tablet",
        "strength": "400mg",
        "manufacturer": "Abbott",
        "description": "Non-steroidal anti-inflammatory drug (NSAID) for inflammation, arthritis, and fever.",
        "requires_prescription": False,
        "is_controlled": False,
        "typical_price": 14.00,
    },
    {
        "brand_name": "Plavix",
        "generic_name": "Clopidogrel Bisulfate",
        "dosage_form": "Tablet",
        "strength": "75mg",
        "manufacturer": "Sanofi",
        "description": "Antiplatelet medication preventing blood clots in post-stent, stroke, and MI patients.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 135.00,
    },
    {
        "brand_name": "Montair",
        "generic_name": "Montelukast Sodium",
        "dosage_form": "Tablet",
        "strength": "10mg",
        "manufacturer": "Cipla",
        "description": "Leukotriene receptor antagonist for prophylaxis and chronic treatment of asthma.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 45.00,
    },
    {
        "brand_name": "Motilium",
        "generic_name": "Domperidone",
        "dosage_form": "Tablet",
        "strength": "10mg",
        "manufacturer": "Janssen-Cilag",
        "description": "Dopamine antagonist antiemetic used for nausea, vomiting, and delayed gastric emptying.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 19.50,
    },
    {
        "brand_name": "Cardicor",
        "generic_name": "Bisoprolol Fumarate",
        "dosage_form": "Tablet",
        "strength": "5mg",
        "manufacturer": "Merck",
        "description": "Cardioselective beta-1 adrenergic blocker for heart failure and angina.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 42.00,
    },
    {
        "brand_name": "Nexium",
        "generic_name": "Esomeprazole Magnesium",
        "dosage_form": "Tablet",
        "strength": "40mg",
        "manufacturer": "AstraZeneca",
        "description": "S-isomer of omeprazole with higher bioavailability for severe gastroesophageal reflux.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 55.00,
    },
    {
        "brand_name": "Flagyl",
        "generic_name": "Metronidazole",
        "dosage_form": "Tablet",
        "strength": "400mg",
        "manufacturer": "Sanofi",
        "description": "Antiprotozoal and anaerobic antibacterial agent.",
        "requires_prescription": True,
        "is_controlled": False,
        "typical_price": 15.00,
    },
]


async def seed_srilanka_dataset():
    """Seed comprehensive Sri Lanka nationwide pharmacy, medicine, and stock data."""
    print("============================================================")
    print(" SEEDING MEDFIND: SRI LANKA NATIONWIDE HEALTHCARE NETWORK")
    print("============================================================")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Clean old records cleanly in foreign-key order
        print("[INFO] Purging prior seed data...")
        await session.execute(delete(Hold))
        await session.execute(delete(Enquiry))
        await session.execute(delete(Stock))
        await session.execute(delete(Pharmacy))
        await session.execute(delete(Medicine))
        await session.execute(delete(User))
        await session.commit()

        # 1. Seed Roles & Users
        print("[INFO] Creating Sri Lankan regional staff and administrative users...")
        users = [
            User(
                email="admin@medfind.local",
                hashed_password=get_password_hash("AdminPass123!"),
                full_name="MedFind Sri Lanka Administrator",
                phone_number="+94 11 268 7788",
                role=UserRole.ADMIN,
                is_active=True,
            ),
            User(
                email="dispensary@metrocare.local",
                hashed_password=get_password_hash("PharmPass123!"),
                full_name="Dr. Nihal Perera (Rajya Osusala Pharmacist)",
                phone_number="+94 11 268 7789",
                role=UserRole.PHARMACY_STAFF,
                is_active=True,
            ),
            User(
                email="patient@medfind.local",
                hashed_password=get_password_hash("PatientPass123!"),
                full_name="Kasun Jayasuriya",
                phone_number="+94 77 123 4567",
                role=UserRole.PATIENT,
                is_active=True,
            ),
            User(
                email="pharmacist.kandy@medfind.local",
                hashed_password=get_password_hash("KandyPass123!"),
                full_name="Kandurata Medicare Pharmacist",
                phone_number="+94 81 223 4568",
                role=UserRole.PHARMACY_STAFF,
                is_active=True,
            ),
            User(
                email="pharmacist.galle@medfind.local",
                hashed_password=get_password_hash("GallePass123!"),
                full_name="Ruhunu Chemists Head Dispenser",
                phone_number="+94 91 224 8890",
                role=UserRole.PHARMACY_STAFF,
                is_active=True,
            ),
            User(
                email="pharmacist.jaffna@medfind.local",
                hashed_password=get_password_hash("JaffnaPass123!"),
                full_name="Jaffna Central Hospital Pharmacist",
                phone_number="+94 21 222 2262",
                role=UserRole.PHARMACY_STAFF,
                is_active=True,
            ),
        ]
        session.add_all(users)
        await session.flush()

        # 2. Seed Pharmacies Across All 25 Districts
        print(f"[INFO] Seeding {len(SRI_LANKA_DISTRICT_PHARMACIES)} pharmacies across all 25 districts of Sri Lanka...")
        pharmacy_objs = []
        for i, p_info in enumerate(SRI_LANKA_DISTRICT_PHARMACIES):
            owner = users[1] if i == 0 else (users[3] if "Kandy" in p_info["city"] else None)
            pharm = Pharmacy(
                owner_id=owner.id if owner else None,
                name=p_info["name"],
                license_number=p_info["license"],
                address=p_info["address"],
                city=p_info["city"],
                postal_code=p_info["postal_code"],
                latitude=p_info["lat"],
                longitude=p_info["lng"],
                phone=p_info["phone"],
                email=p_info["email"],
                opening_hours=p_info["hours"],
                is_verified=True,
                is_active=True,
            )
            pharmacy_objs.append(pharm)
            session.add(pharm)

        await session.flush()

        # 3. Seed Medicines
        print(f"[INFO] Seeding {len(SRI_LANKA_MEDICINES)} common Sri Lankan medicines...")
        medicine_objs = []
        for m_info in SRI_LANKA_MEDICINES:
            med = Medicine(
                brand_name=m_info["brand_name"],
                generic_name=m_info["generic_name"],
                dosage_form=m_info["dosage_form"],
                strength=m_info["strength"],
                manufacturer=m_info["manufacturer"],
                description=m_info["description"],
                requires_prescription=m_info["requires_prescription"],
                is_controlled=m_info["is_controlled"],
            )
            medicine_objs.append(med)
            session.add(med)

        await session.flush()

        # 4. Seed Realistic Stock across all Pharmacies & Medicines
        print("[INFO] Generating realistic inventory stocks with 24-hour freshness timestamps...")
        stocks = []
        now = datetime.now(timezone.utc)

        # For every pharmacy, select between 12 to 20 random medicines to hold in stock
        random.seed(42)  # Deterministic seed for repeatable test results
        stock_count = 0

        for pharm in pharmacy_objs:
            # Pick a subset of medicines for each pharmacy
            med_sample_size = random.randint(12, len(medicine_objs))
            assigned_meds = random.sample(medicine_objs, med_sample_size)

            for med in assigned_meds:
                # Find base typical price
                med_info = next((m for m in SRI_LANKA_MEDICINES if m["brand_name"] == med.brand_name), None)
                base_price = med_info["typical_price"] if med_info else 50.0

                # Slight price variance between pharmacies (+/- 8%)
                unit_price = round(base_price * random.uniform(0.92, 1.08), 2)

                # Stock availability status distribution (70% in stock, 20% low stock, 10% out of stock)
                roll = random.random()
                if roll < 0.70:
                    status = StockStatus.IN_STOCK
                    qty = random.randint(30, 450)
                elif roll < 0.90:
                    status = StockStatus.LOW_STOCK
                    qty = random.randint(3, 15)
                else:
                    status = StockStatus.OUT_OF_STOCK
                    qty = 0

                # Timestamp freshness: 75% updated within last 12 hours (Fresh), 25% > 24 hours ago (Unconfirmed)
                if random.random() < 0.75:
                    mins_ago = random.randint(10, 720)  # 10m to 12h
                    updated_at = now - timedelta(minutes=mins_ago)
                else:
                    hours_ago = random.randint(26, 72)  # > 24 hours
                    updated_at = now - timedelta(hours=hours_ago)

                stock_entry = Stock(
                    pharmacy_id=pharm.id,
                    medicine_id=med.id,
                    quantity=qty,
                    unit_price=unit_price,
                    status=status,
                    last_updated=updated_at,
                )
                stocks.append(stock_entry)
                stock_count += 1

        session.add_all(stocks)
        await session.flush()

        # 5. Seed Demonstration Enquiries & Pickup Holds
        print("[INFO] Seeding initial customer enquiries and 30-minute pharmacy holds...")
        demo_enquiry = Enquiry(
            user_id=users[2].id,
            pharmacy_id=pharmacy_objs[0].id,
            medicine_query="Amoxil 500mg capsules",
            message="Looking for 2 strips of Amoxil 500mg as prescribed by Dr. Perera.",
            contact_phone="+94 77 123 4567",
            status=EnquiryStatus.PENDING,
        )
        session.add(demo_enquiry)

        demo_hold = Hold(
            reservation_code="HOLD-COL-9942",
            user_id=users[2].id,
            pharmacy_id=pharmacy_objs[0].id,
            medicine_id=medicine_objs[0].id,
            quantity=2,
            status=HoldStatus.ACTIVE,
            expires_at=now + timedelta(minutes=28),
        )
        session.add(demo_hold)

        await session.commit()

        print(f"[SUCCESS] Sri Lanka dataset generated successfully!")
        print(f"  • Districts Covered : 25/25 (All Sri Lanka Provinces)")
        print(f"  • Total Pharmacies  : {len(pharmacy_objs)}")
        print(f"  • Total Medicines   : {len(medicine_objs)}")
        print(f"  • Total Stock Items : {stock_count}")
        print(f"  • Registered Users  : {len(users)}")
        print("============================================================")


if __name__ == "__main__":
    asyncio.run(seed_srilanka_dataset())
