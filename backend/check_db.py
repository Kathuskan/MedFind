import sqlite3
import os

db_path = "medfind.db"
print("=" * 60)
print(" MEDFIND DATABASE HEALTH CHECK")
print("=" * 60)

if not os.path.exists(db_path):
    print(f"[FAIL] Database file '{db_path}' not found!")
    exit(1)

print(f"[OK] Database file found at: {os.path.abspath(db_path)} ({os.path.getsize(db_path)} bytes)")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cursor.fetchall() if not r[0].startswith('sqlite_')]
    
    print(f"[OK] Successfully connected! Found {len(tables)} tables:")
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {t}")
        count = cursor.fetchone()[0]
        print(f"  • {t.ljust(20)}: {count} records")

    # Sample query on users
    if "users" in tables:
        cursor.execute("SELECT email, role, full_name FROM users LIMIT 3")
        users = cursor.fetchall()
        print("\n[SAMPLE DATA] Users in database:")
        for u in users:
            print(f"  - {u[0]} (Role: {u[1]}, Name: {u[2]})")

    # Sample query on medicines
    if "medicines" in tables:
        cursor.execute("SELECT brand_name, generic_name, dosage_form, strength FROM medicines LIMIT 3")
        meds = cursor.fetchall()
        print("\n[SAMPLE DATA] Medicines in database:")
        for m in meds:
            print(f"  - {m[0]} ({m[1]}) - {m[3]} {m[2]}")

    # Sample query on pharmacies
    if "pharmacies" in tables:
        cursor.execute("SELECT name, license_number, city, phone FROM pharmacies LIMIT 3")
        pharms = cursor.fetchall()
        print("\n[SAMPLE DATA] Pharmacies in database:")
        for p in pharms:
            print(f"  - {p[0]} [Lic: {p[1]}] in {p[2]} (Tel: {p[3]})")

    conn.close()
    print("\n" + "=" * 60)
    print(" RESULT: DATABASE IS FULLY OPERATIONAL AND FUNCTIONING!")
    print("=" * 60)

except Exception as e:
    print(f"\n[ERROR] Database check failed: {e}")
