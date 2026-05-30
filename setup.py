from setuptools import setup, find_packages

setup(
    name="policyguard",
    version="0.1.0",
    description="Privacy-first AI policy framework for non-profits",
    author="Tejaswini Gonegandla",
    author_email="tejaswiniveliventi@gmail.com",
    url="https://github.com/tejaswiniveliventi/policyguard",
    packages=find_packages(),
    python_requires=">=3.10",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
)